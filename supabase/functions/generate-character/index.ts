import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildPrompt(fields: Record<string, string>, hasReferenceImage: boolean): string {
  const { seeNotes, sayKeywords, showInterpretation, finalSentence, timePeriod } = fields;

  let prompt = `Create a full-body, photorealistic image of a historical person from the ${timePeriod || "Victorian era"}. Plain white studio background only. Neutral studio lighting. High realism suitable for later 3D modelling.

Use the following historical evidence to construct the person's appearance, clothing, and posture:

- Historical time period: ${timePeriod || "Not specified"}
- Observed visual clues: ${seeNotes}
- Key descriptors: ${sayKeywords}
- What this suggests about the person: ${showInterpretation}
- Core description: ${finalSentence}`;

  if (hasReferenceImage) {
    prompt += `\n\nUse the uploaded reference image to maintain consistent facial features and likeness.`;
  }

  prompt += `

The character must:
- Stand in a neutral upright position.
- Be dressed authentically for the ${timePeriod || "historical period"} implied by the evidence.
- Reflect the personality, status, and era suggested by the evidence through clothing, posture, and grooming.
- No objects. No modern elements. No logos. No text.
- Avoid illustration, painting, CGI or stylised rendering.`;

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

    const { fields, referenceImageBase64 } = await req.json();

    if (!fields) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const hasReferenceImage = !!referenceImageBase64;
    const finalPrompt = buildPrompt(fields, hasReferenceImage);

    // Build message content - include reference image if available
    const messageContent = hasReferenceImage
      ? [
          { type: "text", text: finalPrompt },
          { type: "image_url", image_url: { url: referenceImageBase64 } },
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
        JSON.stringify({ error: "Image generation failed" }),
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
    console.error("generate-character error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
