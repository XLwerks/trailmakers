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

function buildPrompt(fields: Record<string, string>, objectRelation: string): string {
  const { see, say, finalSentence } = fields;

  const relationDesc = objectRelation === "holding"
    ? "The character is holding the object naturally in their hands."
    : "The character is standing next to the object, which is placed beside them at an appropriate scale.";

  return `Create a photorealistic full-body image of a historical character with their important object. Plain white background. Studio lighting, sharp focus, high detail.

Use the following evidence gathered by students:

- Visual observations about clothing and appearance (SEE): ${see}
- Key words and phrases from research (SAY): ${say}
- Student's descriptive sentence: ${finalSentence}

Important composition instructions:
- ${relationDesc}
- The character's face must closely match the uploaded face reference image
- The object must closely match the uploaded object reference image
- The character should be dressed in historically appropriate clothing as described
- Full body must be visible from head to toe
- Plain white background, no scenery
- Photorealistic quality — avoid illustration, painting, CGI or stylised rendering
- No text, labels, or watermarks`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { fields, faceImageBase64, objectImageBase64, objectRelation, className } = await req.json();
    if (!fields) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const finalPrompt = buildPrompt(fields, objectRelation || "holding");

    const messageContent: Array<Record<string, unknown>> = [
      { type: "text", text: finalPrompt },
    ];

    if (faceImageBase64) {
      messageContent.push({ type: "image_url", image_url: { url: faceImageBase64 } });
    }
    if (objectImageBase64) {
      messageContent.push({ type: "image_url", image_url: { url: objectImageBase64 } });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Usage limit reached." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Full body generation failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageUrl) {
      return new Response(JSON.stringify({ error: "No image was generated. Try adjusting the inputs." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const storedUrl = await saveToStorage(generatedImageUrl, "compulsory-fullbody", className);

    return new Response(
      JSON.stringify({ imageUrl: generatedImageUrl, storedUrl, debugPrompt: finalPrompt }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-compulsory-fullbody error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
