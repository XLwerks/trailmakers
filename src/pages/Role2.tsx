import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PortraitForm from "@/components/PortraitForm";
import ResultPanel from "@/components/ResultPanel";
import DebugPanel from "@/components/DebugPanel";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Role2Props {
  portraitImageUrl: string | null;
}

const Role2 = ({ portraitImageUrl }: Role2Props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show prompt to go back if no portrait, but don't block access
  const needsPortrait = !portraitImageUrl;

  const handleGenerate = async (
    fields: Record<string, string>,
    imageBase64?: string
  ) => {
    // Use portrait from Role 1, or manually uploaded image
    const imageToUse = portraitImageUrl || imageBase64 || null;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setDebugPrompt(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-character",
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
      toast.success("Character generated successfully!");
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
      {/* Header */}
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
              Role 2 – Making a full character image
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
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
              Role 2
            </span>
            <span className="text-xs text-muted-foreground">→</span>
            <button
              onClick={() => navigate("/role3")}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Role 3
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Portrait reference thumbnail (only if from Role 1) */}
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
          {/* Left: Form */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-1 text-foreground">
              Character Details
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {portraitImageUrl
                ? "Describe the clothing to extend the portrait into a full-body image"
                : "Upload a reference portrait and describe the clothing to generate a full-body image"}
            </p>
            <PortraitForm onSubmit={handleGenerate} isLoading={isLoading} showImageUpload={!portraitImageUrl} />
          </div>

          {/* Right: Result */}
          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">
                Generated Image
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Full-body photorealistic character output
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

export default Role2;
