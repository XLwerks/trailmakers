import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useClassName } from "@/hooks/useClassName";
import PortraitForm, { FormFields } from "@/components/PortraitForm";
import ResultPanel from "@/components/ResultPanel";
import DebugPanel from "@/components/DebugPanel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";

interface Role1Props {
  timePeriod: string;
  onTimePeriodChange: (value: string) => void;
  fields: FormFields;
  onFieldsChange: (fields: FormFields) => void;
  generatedImage: string | null;
  onGeneratedImage: (url: string | null) => void;
  debugPrompt: string | null;
  onDebugPrompt: (p: string | null) => void;
}

const Role1 = ({ timePeriod, onTimePeriodChange, fields, onFieldsChange, generatedImage, onGeneratedImage, debugPrompt, onDebugPrompt }: Role1Props) => {
  const navigate = useNavigate();
  const { className } = useClassName();
  const [isLoading, setIsLoading] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (submissionFields: Record<string, string>) => {
    setIsLoading(true);
    setError(null);
    onGeneratedImage(null);
    onDebugPrompt(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-portrait",
        { body: { fields: submissionFields, className } }
      );

      if (fnError) throw new Error(fnError.message || "Generation failed");
      if (data?.error) throw new Error(data.error);

      onGeneratedImage(data.imageUrl);
      onDebugPrompt(data.debugPrompt);
      toast.success("Portrait generated successfully!");
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
          <button onClick={() => navigate("/portal")} className="text-accent-foreground/70 hover:text-accent-foreground transition-colors">
            <Home className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-accent-foreground leading-tight">IPSWICH TRAIL MAKERS</h1>
            <p className="text-xs text-accent-foreground/70">Task 1 – Head &amp; Shoulders Portrait</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-accent-foreground bg-accent-foreground/20 px-2 py-1 rounded">Task 1</span>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/ed-caley/role2")} className="text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors cursor-pointer">Task 2</button>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/ed-caley/role3")} className="text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors cursor-pointer">Task 3</button>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/ed-caley/role4")} className="text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors cursor-pointer">Task 4</button>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/ed-caley/role5")} className="text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors cursor-pointer">Task 5</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Historical Evidence</h2>
            <p className="text-sm text-muted-foreground mb-6">Describe the person using historical evidence to generate a photorealistic portrait</p>
            <PortraitForm
              onSubmit={handleGenerate}
              isLoading={isLoading}
              timePeriod={timePeriod}
              onTimePeriodChange={onTimePeriodChange}
              fields={fields}
              onFieldsChange={onFieldsChange}
            />
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Generated Portrait</h2>
              <p className="text-sm text-muted-foreground mb-6">Head &amp; shoulders photorealistic portrait</p>
              <ResultPanel imageUrl={generatedImage} isLoading={isLoading} error={error} taskType="portrait" />
              {generatedImage && !isLoading && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => navigate("/ed-caley/role2")} className="font-display text-base tracking-wide h-12 gap-2">
                    Proceed to Task 2
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <DebugPanel prompt={debugPrompt} isOpen={debugOpen} onToggle={() => setDebugOpen(!debugOpen)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Role1;
