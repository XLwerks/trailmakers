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

function buildPrompt(fields: Record<string, string>, hasReferenceImage: boolean): string {
  const { seeNotes, sayKeywords, showInterpretation, finalSentence, timePeriod } = fields;

  let prompt = `Create a head-and-shoulders portrait in the style of an authentic Victorian-era wet plate collodion photograph from the ${timePeriod || "1850s–1880s"}. The image must look like a genuine period photograph, not a modern recreation.

Use the following evidence about the desired photographic style:

- Historical time period: ${timePeriod || "Not specified"}
- Observed visual clues about the photograph style: ${seeNotes}
- Key style descriptors: ${sayKeywords}
- What this evidence shows about historical photography: ${showInterpretation}
- Core style description: ${finalSentence}`;

  if (hasReferenceImage) {
    prompt += `\n\nUse the uploaded reference image to maintain consistent facial features and likeness. Apply the Victorian wet plate photographic style to this face.`;
  }

  prompt += `

The photograph must have:
- Sepia or warm monochrome toning typical of collodion wet plate process
- Soft focus with slight vignetting around the edges
- Visible grain, subtle imperfections, and tonal irregularities characteristic of early photography
- Period-appropriate lighting: directional, slightly harsh, with deep shadows
- A plain dark or mottled studio backdrop typical of Victorian portrait studios
- The subject should appear composed and still, with the solemn neutral expression common in long-exposure Victorian portraits
- Period-appropriate hairstyle and grooming if visible

Do NOT include:
- Modern elements, logos, or text
- Colour photography
- Illustration, painting, CGI, or stylised rendering
- Full body — head and shoulders framing only`;

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

    const { fields, referenceImageBase64, className } = await req.json();

    if (!fields) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const hasReferenceImage = !!referenceImageBase64;
    const finalPrompt = buildPrompt(fields, hasReferenceImage);

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
        JSON.stringify({ error: "Victorian portrait generation failed" }),
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

    const storedUrl = await saveToStorage(generatedImageUrl, "victorian-portrait");

    return new Response(
      JSON.stringify({
        imageUrl: generatedImageUrl,
        storedUrl,
        debugPrompt: finalPrompt,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-victorian-portrait error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
