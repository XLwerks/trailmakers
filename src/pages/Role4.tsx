import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ResultPanel from "@/components/ResultPanel";
import DebugPanel from "@/components/DebugPanel";
import { Loader2, Camera, Upload } from "lucide-react";
import trailmakersLogo from "@/assets/trailmakers-logo.png";
import { FormFields } from "@/components/PortraitForm";

interface Role4Props {
  timePeriod: string;
  onTimePeriodChange: (value: string) => void;
  fields: FormFields;
  onFieldsChange: (fields: FormFields) => void;
  generatedImage: string | null;
  onGeneratedImage: (url: string | null) => void;
  debugPrompt: string | null;
  onDebugPrompt: (p: string | null) => void;
  charImage: string | null;
  onCharImageChange: (img: string | null) => void;
}

const Role4 = ({ timePeriod, onTimePeriodChange, fields, onFieldsChange, generatedImage, onGeneratedImage, debugPrompt, onDebugPrompt, charImage, onCharImageChange }: Role4Props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const charFileRef = useRef<HTMLInputElement>(null);

  const updateField = (key: string, value: string) => {
    onFieldsChange({ ...fields, [key]: value });
  };

  const updateKeyword = (index: number, value: string) => {
    const keywords = [...fields.keywords];
    keywords[index] = value;
    onFieldsChange({ ...fields, keywords });
  };

  const handleCharFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onCharImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    onGeneratedImage(null);
    onDebugPrompt(null);

    try {
      const { keywords, ...rest } = fields;
      const submissionFields = {
        ...rest,
        sayKeywords: keywords.filter(k => k.trim()).join(", "),
        timePeriod,
      };
      const { data, error: fnError } = await supabase.functions.invoke("generate-environment", {
        body: { fields: submissionFields, characterImageBase64: charImage },
      });
      if (fnError) throw new Error(fnError.message || "Generation failed");
      if (data?.error) throw new Error(data.error);

      onGeneratedImage(data.imageUrl);
      onDebugPrompt(data.debugPrompt);
      toast.success("Environment image generated successfully!");
    } catch (err: any) {
      const message = err?.message || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasKeywords = fields.keywords.some(k => k.trim());
  const isValid = fields.seeNotes && hasKeywords && fields.showInterpretation && fields.finalSentence;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <img src={trailmakersLogo} alt="Trailmakers" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground leading-tight">Trailmakers Ai</h1>
            <p className="text-xs text-muted-foreground">Role 4 – Pre-Development Environment</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/ed-caley")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Role 1</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/ed-caley/role2")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Role 2</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/ed-caley/role3")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Role 3</button>
            <span className="text-xs text-muted-foreground">→</span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Role 4</span>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/ed-caley/role5")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Role 5</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Environment Evidence</h2>
            <p className="text-sm text-muted-foreground mb-6">Describe the pre-development docks environment and upload the full-body character to place in the scene</p>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <Label htmlFor="timePeriod">Time Period *</Label>
                <Input id="timePeriod" value={timePeriod} onChange={(e) => onTimePeriodChange(e.target.value)} placeholder="e.g. 1830s England, Early Victorian era" className="text-sm" />
              </div>

              <div>
                <Label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-2 block">Full-Body Character Image</Label>
                <div onClick={() => charFileRef.current?.click()} className="relative cursor-pointer border-2 border-dashed border-border rounded-lg h-48 flex items-center justify-center bg-secondary/50 hover:bg-secondary transition-colors overflow-hidden">
                  {charImage ? (
                    <img src={charImage} alt="Character" className="h-full w-full object-contain" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Upload the full-body character to integrate into the scene</span>
                    </div>
                  )}
                </div>
                <input ref={charFileRef} type="file" accept="image/jpeg,image/png" onChange={handleCharFileChange} className="hidden" />
              </div>

              <div>
                <Label htmlFor="seeNotes">SEE – What do you notice about the environment? *</Label>
                <Textarea id="seeNotes" value={fields.seeNotes} onChange={(e) => updateField("seeNotes", e.target.value)} placeholder="e.g. Tidal mudflats, uneven riverbanks, scattered wooden jetties, smoke from nearby buildings" rows={3} />
              </div>

              <div>
                <Label>SAY – What does the research tell you? (key words/phrases) *</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {fields.keywords.map((kw, i) => (
                    <Input key={i} value={kw} onChange={(e) => updateKeyword(i, e.target.value)} placeholder={`Keyword ${i + 1}`} className="text-sm" />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="showInterpretation">SHOW – What might life at the docks have felt like? *</Label>
                <Textarea id="showInterpretation" value={fields.showInterpretation} onChange={(e) => updateField("showInterpretation", e.target.value)} placeholder="e.g. A busy, noisy working waterfront where trade and labour shaped daily life before any formal dock construction" rows={3} />
              </div>

              <div>
                <Label htmlFor="finalSentence">Final Sentence – Before construction, the docks were… *</Label>
                <Textarea id="finalSentence" value={fields.finalSentence} onChange={(e) => updateField("finalSentence", e.target.value)} placeholder="e.g. Before construction, the docks were a muddy tidal riverbank lined with timber wharves and cluttered with cargo from small sailing vessels" rows={2} />
              </div>

              <Button type="submit" disabled={!isValid || isLoading} className="w-full font-display text-base tracking-wide h-12">
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating…</>) : (<><Camera className="mr-2 h-4 w-4" />Generate Environment</>)}
              </Button>
            </form>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Generated Environment</h2>
              <p className="text-sm text-muted-foreground mb-6">Landscape photographic scene with character integrated</p>
              <ResultPanel imageUrl={generatedImage} isLoading={isLoading} error={error} />
            </div>
            <DebugPanel prompt={debugPrompt} isOpen={debugOpen} onToggle={() => setDebugOpen(!debugOpen)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Role4;
