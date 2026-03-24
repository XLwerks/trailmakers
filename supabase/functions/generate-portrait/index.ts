import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { decode as decodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function saveToStorage(base64DataUrl: string, role: string, className?: string): Promise<string | null> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    const matches = base64DataUrl.match(/^data:image\/([\w+]+);base64,(.+)$/);
    if (!matches) return null;
    
    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const imageBytes = decodeBase64(matches[2]);
    const classSlug = className ? className.replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "-") : "unknown";
    const fileName = `${role}/${classSlug}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    
    const { error } = await supabase.storage
      .from("generated-images")
      .upload(fileName, imageBytes, { contentType: `image/${matches[1]}`, upsert: false });
    
    if (error) {
      console.error("Storage upload error:", error);
      return null;
    }
    
    const { data } = supabase.storage.from("generated-images").getPublicUrl(fileName);
    return data.publicUrl;
  } catch (e) {
    console.error("saveToStorage error:", e);
    return null;
  }
}

function buildPrompt(fields: Record<string, string>): string {
  const { seeNotes, sayKeywords, showInterpretation, finalSentence, timePeriod } = fields;

  let prompt = `Create a photorealistic head-and-shoulders portrait of a historical person from the ${timePeriod || "Victorian era"}. Plain white studio background only. Neutral lighting, realistic skin texture, sharp focus. Head and shoulders framing.

CRITICAL REALISM RULE: Do NOT beautify or idealise the face. This must look like a real, ordinary person — NOT a model or actor. Include natural human imperfections such as: asymmetrical features, uneven skin tone, visible pores, blemishes, age spots, sun damage, crooked or gapped teeth, a slightly off-centre nose, bags under the eyes, rough or weathered skin, or any combination of these. The person should look like they lived a hard-working life appropriate to their historical period. Avoid smooth, flawless, symmetrical, or magazine-quality faces.

Use the following historical evidence to construct the face and expression:

- Historical time period: ${timePeriod || "Not specified"}
- Observed visual clues: ${seeNotes}
- Key facial descriptors: ${sayKeywords}
- What this suggests about the person: ${showInterpretation}
- Core description: ${finalSentence}

The portrait must be in FULL COLOUR (not black and white, not sepia, not monochrome). Use natural, realistic skin tones and colours throughout. The portrait must strongly reflect the facial features and personality implied by this evidence. The hairstyle, grooming, and any visible details must be authentic to the ${timePeriod || "historical period"} specified. Avoid modern styling unless explicitly indicated. Avoid illustration, painting, CGI or stylised rendering.`;

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

    const { fields, className } = await req.json();

    if (!fields) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const finalPrompt = buildPrompt(fields);

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
              content: finalPrompt,
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
        JSON.stringify({ error: "Portrait generation failed" }),
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

    const storedUrl = await saveToStorage(generatedImageUrl, "portrait");

    return new Response(
      JSON.stringify({
        imageUrl: generatedImageUrl,
        storedUrl,
        debugPrompt: finalPrompt,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-portrait error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
