import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildPrompt(fields: Record<string, string>, hasCharacterImage: boolean): string {
  const { seeNotes, sayKeywords, showInterpretation, finalSentence, timePeriod } = fields;

  let prompt = `Create a photorealistic landscape-format image of a historical docks environment from the ${timePeriod || "early 19th century"} before formal construction began. The image must be in landscape orientation (wider than tall). High realism, photographic quality, natural lighting.

Use the following historical evidence to construct the scene:

- Historical time period: ${timePeriod || "Not specified"}
- Observed visual clues about the environment: ${seeNotes}
- Key environmental descriptors: ${sayKeywords}
- What life at the docks felt like: ${showInterpretation}
- Core environment description: ${finalSentence}`;

  if (hasCharacterImage) {
    prompt += `

CRITICAL CHARACTER INTEGRATION RULES:
- The uploaded character image MUST be integrated into this environment scene.
- SCALE IS PARAMOUNT: The character must be realistically sized relative to the environment. A human figure should be approximately 1/6th to 1/8th the height of the overall image. They should appear as a normal-sized person within a wide landscape — NOT oversized, NOT dominating the frame.
- The character should be placed mid-ground or background, standing naturally on the ground (quayside, mudflat, or path), surrounded by other elements (buildings, boats, cargo, other people) that establish correct scale.
- Use surrounding architectural elements (doorways ~2m tall, warehouse walls, barrels, crates, bollards) as scale references to ensure the character is proportionally correct.
- Match the character's lighting, shadow direction, and colour grading to the rest of the scene so they look embedded, not composited.
- Preserve the character's exact appearance, clothing, and features from the uploaded image.
- The character should NOT be centred or prominent — they are ONE person in a busy, wide landscape scene.`;
  }

  prompt += `

The environment must:
- Show a pre-industrial or early-industrial waterfront scene
- Include period-appropriate details: tidal water, muddy banks, timber structures, sailing vessels, warehouses
- Use natural, overcast or hazy lighting typical of a working river environment
- Feel lived-in and authentic — signs of labour, trade, and daily waterfront activity
- Be in LANDSCAPE orientation (wider than tall)
- No modern elements, no text, no logos
- Avoid illustration, painting, CGI or stylised rendering — photographic realism only`;

  return prompt;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { fields, characterImageBase64 } = await req.json();

    if (!fields) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const hasCharacterImage = !!characterImageBase64;
    const finalPrompt = buildPrompt(fields, hasCharacterImage);

    const messageContent = hasCharacterImage
      ? [
          { type: "text", text: finalPrompt },
          { type: "image_url", image_url: { url: characterImageBase64 } },
        ]
      : finalPrompt;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: messageContent,
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Environment generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedImageUrl =
      data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageUrl) {
      return new Response(
        JSON.stringify({ error: "No image was generated. Try adjusting the inputs." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        imageUrl: generatedImageUrl,
        debugPrompt: finalPrompt,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-environment error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
