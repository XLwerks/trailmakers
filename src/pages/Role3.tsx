import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PortraitForm, { FieldLabels } from "@/components/PortraitForm";
import ResultPanel from "@/components/ResultPanel";
import DebugPanel from "@/components/DebugPanel";
import { Compass } from "lucide-react";

interface Role3Props {
  portraitImageUrl: string | null;
}

const role3Labels: FieldLabels = {
  seeLabel: "SEE – What do you notice about the photographs? *",
  seePlaceholder: "e.g. Warm sepia tones, soft focus, slightly worn edges, dark vignetting around the frame",
  sayLabel: "SAY – What does the research tell you? (key words/phrases) *",
  sayPlaceholder: "e.g. long exposure, glass plate, chemical staining, faded contrast, sepia tones",
  showLabel: "SHOW – What makes these images feel historical? *",
  showPlaceholder: "e.g. The grain and imperfections suggest early photographic processes with limited control over light and exposure",
  finalLabel: "Final Sentence – The image should look… *",
  finalPlaceholder: "e.g. The image should look like a faded 1860s wet plate portrait with warm sepia tones and visible grain from early photography",
  imageUploadLabel: "Reference Image",
  imageUploadHint: "Upload the portrait to apply Victorian photographic styling",
};

const Role3 = ({ portraitImageUrl }: Role3Props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (
    fields: Record<string, string>,
    imageBase64?: string
  ) => {
    const imageToUse = portraitImageUrl || imageBase64 || null;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setDebugPrompt(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-victorian-portrait",
        {
          body: { fields, referenceImageBase64: imageToUse },
        }
      );

      if (fnError) {
        throw new Error(fnError.message || "Generation failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setGeneratedImage(data.imageUrl);
      setDebugPrompt(data.debugPrompt);
      toast.success("Victorian portrait generated successfully!");
    } catch (err: any) {
      const message = err?.message || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground leading-tight">
              Trailmakers Ai
            </h1>
            <p className="text-xs text-muted-foreground">
              Worksheet 3 – Victorian Photograph Style
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Role 1
            </button>
            <span className="text-xs text-muted-foreground">→</span>
            <button
              onClick={() => navigate("/role2")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Role 2
            </button>
            <span className="text-xs text-muted-foreground">→</span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
              Role 3
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {portraitImageUrl && (
          <div className="mb-6 flex items-center gap-3 bg-card rounded-lg border border-border p-3">
            <img
              src={portraitImageUrl}
              alt="Role 1 portrait"
              className="w-12 h-12 rounded-lg object-cover border border-border"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">Reference Portrait</p>
              <p className="text-xs text-muted-foreground">Generated in Role 1 — used as facial likeness reference</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-1 text-foreground">
              Photographic Style Evidence
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {portraitImageUrl
                ? "Describe the Victorian photographic style to transform the portrait"
                : "Upload a reference portrait and describe the Victorian photographic style"}
            </p>
            <PortraitForm onSubmit={handleGenerate} isLoading={isLoading} showImageUpload={!portraitImageUrl} fieldLabels={role3Labels} />
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">
                Generated Portrait
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Victorian wet plate style head &amp; shoulders portrait
              </p>
              <ResultPanel
                imageUrl={generatedImage}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <DebugPanel
              prompt={debugPrompt}
              isOpen={debugOpen}
              onToggle={() => setDebugOpen(!debugOpen)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Role3;
