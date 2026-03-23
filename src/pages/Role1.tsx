import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PortraitForm, { FormFields } from "@/components/PortraitForm";
import ResultPanel from "@/components/ResultPanel";
import DebugPanel from "@/components/DebugPanel";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import trailmakersLogo from "@/assets/trailmakers-logo.png";

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
        { body: { fields: submissionFields } }
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
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <img src={trailmakersLogo} alt="Trailmakers" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground leading-tight">Trailmakers Ai</h1>
            <p className="text-xs text-muted-foreground">Role 1 – Head &amp; Shoulders Portrait</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Role 1</span>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/ed-caley/role2")} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Role 2</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/ed-caley/role3")} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Role 3</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/ed-caley/role4")} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Role 4</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/ed-caley/role5")} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Role 5</button>
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
              <ResultPanel imageUrl={generatedImage} isLoading={isLoading} error={error} />
              {generatedImage && !isLoading && (
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => navigate("/ed-caley/role2")} className="font-display text-base tracking-wide h-12 gap-2">
                    Proceed to Role 2
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
