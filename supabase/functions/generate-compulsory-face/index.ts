import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { decode as decodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function saveToStorage(base64DataUrl: string, role: string): Promise<string | null> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    const matches = base64DataUrl.match(/^data:image\/([\w+]+);base64,(.+)$/);
    if (!matches) return null;
    
    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const imageBytes = decodeBase64(matches[2]);
    const fileName = `${role}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
    
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
  const { see, say, finalSentence } = fields;

  return `Create a photorealistic close-up portrait of a historical person, framed from the neck upwards only — no shoulders visible. Plain white studio background only. Neutral lighting, realistic skin texture, sharp focus. Tightly cropped head shot.

CRITICAL FRAMING RULE: The entire head, face, and any headwear (hats, bonnets, caps, scarves, etc.) MUST fit completely within the image frame with generous padding around all edges. Nothing should be cropped or extend beyond the image borders. Leave clear white space above the head and on all sides.

Use the following evidence gathered by students:

- Visual observations (SEE): ${see}
- Key words and phrases from research (SAY): ${say}
- Student's descriptive sentence: ${finalSentence}

The portrait must be:
- Cropped tightly from the neck up — absolutely NO shoulders, chest, or torso visible
- The ENTIRE head and any headwear must be fully visible within the frame — nothing cut off at edges
- Leave at least 10% white space padding above the highest point of the head or headwear
- In FULL COLOUR (not black and white, not sepia, not monochrome)
- Use natural, realistic skin tones and colours throughout
- The facial features, expression, and mood must strongly reflect the evidence provided
- Hairstyle and grooming should be historically appropriate
- Avoid modern styling unless explicitly indicated
- Avoid illustration, painting, CGI or stylised rendering
- Plain white background, no props, no scenery`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { fields } = await req.json();
    if (!fields) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const finalPrompt = buildPrompt(fields);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: finalPrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "Usage limit reached." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Face generation failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImageUrl) {
      return new Response(JSON.stringify({ error: "No image was generated. Try adjusting the inputs." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const storedUrl = await saveToStorage(generatedImageUrl, "compulsory-face");

    return new Response(
      JSON.stringify({ imageUrl: generatedImageUrl, storedUrl, debugPrompt: finalPrompt }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-compulsory-face error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
