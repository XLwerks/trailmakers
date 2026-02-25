import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildPrompt(fields: Record<string, string>, hasCharacterImage: boolean): string {
  const { seeNotes, sayKeywords, showInterpretation, finalSentence } = fields;

  let prompt = `Create a photorealistic landscape-format image of a historical docks environment AFTER formal wet dock construction was completed. The image must be in landscape orientation (wider than tall). High realism, photographic quality, natural lighting.

Use the following historical evidence to construct the scene:

- Observed visual clues about the post-construction docks: ${seeNotes}
- Key environmental descriptors: ${sayKeywords}
- How engineering changed the waterfront: ${showInterpretation}
- Core environment description: ${finalSentence}`;

  if (hasCharacterImage) {
    prompt += `

CRITICAL: The uploaded character image MUST be integrated into this environment scene. Place the character naturally within the landscape — standing on the quayside or dock edge, at an appropriate scale relative to surroundings, with consistent lighting and perspective. The character should look like they belong in this environment, not composited on top. Preserve the character's exact appearance, clothing, and features from the uploaded image.`;
  }

  prompt += `

The environment must:
- Show a completed, engineered wet dock environment — enclosed basins, stone or brick walls, lock gates
- Include period-appropriate industrial structures: warehouses, cranes, cargo hoists, bollards, cobbled quaysides
- Show controlled water levels within the dock basin, in contrast to tidal conditions outside
- Use natural, overcast or hazy lighting typical of an industrial port environment
- Feel like a working, organised industrial waterfront — signs of engineering, trade, and maritime activity
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
          messages: [{ role: "user", content: messageContent }],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Environment generation failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageUrl) {
      return new Response(JSON.stringify({ error: "No image was generated. Try adjusting the inputs." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(
      JSON.stringify({ imageUrl: generatedImageUrl, debugPrompt: finalPrompt }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-post-construction error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
