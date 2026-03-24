import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useClassName } from "@/hooks/useClassName";
import PortraitForm, { FieldLabels, FormFields } from "@/components/PortraitForm";
import ResultPanel from "@/components/ResultPanel";
import DebugPanel from "@/components/DebugPanel";
import { Home } from "lucide-react";

interface Role3Props {
  timePeriod: string;
  fields: FormFields;
  onFieldsChange: (fields: FormFields) => void;
  generatedImage: string | null;
  onGeneratedImage: (url: string | null) => void;
  debugPrompt: string | null;
  onDebugPrompt: (p: string | null) => void;
  referenceImage: string | null;
  onReferenceImageChange: (img: string | null) => void;
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

const Role3 = ({ timePeriod, fields, onFieldsChange, generatedImage, onGeneratedImage, debugPrompt, onDebugPrompt, referenceImage, onReferenceImageChange }: Role3Props) => {
  const navigate = useNavigate();
  const { className } = useClassName();
  const [isLoading, setIsLoading] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (submissionFields: Record<string, string>, imageBase64?: string) => {
    const imageToUse = imageBase64 || null;
    setIsLoading(true);
    setError(null);
    onGeneratedImage(null);
    onDebugPrompt(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("generate-victorian-portrait", {
        body: { fields: submissionFields, referenceImageBase64: imageToUse, className },
      });
      if (fnError) throw new Error(fnError.message || "Generation failed");
      if (data?.error) throw new Error(data.error);

      onGeneratedImage(data.imageUrl);
      onDebugPrompt(data.debugPrompt);
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
      <header className="border-b border-accent bg-accent backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-accent-foreground/70 hover:text-accent-foreground transition-colors">
            <Home className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-accent-foreground leading-tight">IPSWICH TRAIL MAKERS</h1>
            <p className="text-xs text-accent-foreground/70">Task 3 – Victorian Photograph Style</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/ed-caley")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Task 1</button>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/ed-caley/role2")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Task 2</button>
            <span className="text-xs text-accent-foreground/50">→</span>
            <span className="text-xs font-semibold text-accent-foreground bg-accent-foreground/20 px-2 py-1 rounded">Task 3</span>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/ed-caley/role4")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Task 4</button>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/ed-caley/role5")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Task 5</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Photographic Style Evidence</h2>
            <p className="text-sm text-muted-foreground mb-6">Upload a reference portrait and describe the Victorian photographic style</p>
            <PortraitForm
              onSubmit={handleGenerate}
              isLoading={isLoading}
              showImageUpload={true}
              fieldLabels={role3Labels}
              timePeriod={timePeriod}
              fields={fields}
              onFieldsChange={onFieldsChange}
              referenceImage={referenceImage}
              onReferenceImageChange={onReferenceImageChange}
            />
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Generated Portrait</h2>
              <p className="text-sm text-muted-foreground mb-6">Victorian wet plate style head &amp; shoulders portrait</p>
              <ResultPanel imageUrl={generatedImage} isLoading={isLoading} error={error} taskType="victorian-portrait" />
            </div>
            <DebugPanel prompt={debugPrompt} isOpen={debugOpen} onToggle={() => setDebugOpen(!debugOpen)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Role3;
