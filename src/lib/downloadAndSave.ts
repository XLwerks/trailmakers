import { supabase } from "@/integrations/supabase/client";

export async function downloadAndSave(
  imageUrl: string,
  taskType: string,
  className: string,
  fileName: string
) {
  // Save to backend storage (fire and forget — don't block download)
  supabase.functions.invoke("save-generated-image", {
    body: { imageBase64: imageUrl, taskType, className },
  }).catch((err) => console.error("Backend save failed:", err));

  // Download locally
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
