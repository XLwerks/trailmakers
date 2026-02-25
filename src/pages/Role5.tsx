import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ResultPanel from "@/components/ResultPanel";
import DebugPanel from "@/components/DebugPanel";
import { Compass, Loader2, Camera, Upload } from "lucide-react";

interface Role5Props {
  characterImageUrl: string | null;
}

const Role5 = ({ characterImageUrl }: Role5Props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [debugPrompt, setDebugPrompt] = useState<string | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [charPreview, setCharPreview] = useState<string | null>(characterImageUrl);
  const [charBase64, setCharBase64] = useState<string>(characterImageUrl || "");
  const charFileRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    seeNotes: "",
    sayKeywords: "",
    showInterpretation: "",
    finalSentence: "",
  });

  const updateField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleCharFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCharPreview(result);
      setCharBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageToUse = charBase64 || characterImageUrl || null;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setDebugPrompt(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "generate-post-construction",
        {
          body: { fields, characterImageBase64: imageToUse },
        }
      );

      if (fnError) throw new Error(fnError.message || "Generation failed");
      if (data?.error) throw new Error(data.error);

      setGeneratedImage(data.imageUrl);
      setDebugPrompt(data.debugPrompt);
      toast.success("Post-construction environment generated successfully!");
    } catch (err: any) {
      const message = err?.message || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    fields.seeNotes &&
    fields.sayKeywords &&
    fields.showInterpretation &&
    fields.finalSentence;

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
              Role 5 – Post-Construction Environment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Role 1</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/role2")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Role 2</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/role3")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Role 3</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/role4")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Role 4</button>
            <span className="text-xs text-muted-foreground">→</span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Role 5</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-1 text-foreground">
              Post-Construction Evidence
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Describe the docks after construction and upload the full-body character to place in the scene
            </p>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <Label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-2 block">
                  Full-Body Character Image
                </Label>
                <div
                  onClick={() => charFileRef.current?.click()}
                  className="relative cursor-pointer border-2 border-dashed border-border rounded-lg h-48 flex items-center justify-center bg-secondary/50 hover:bg-secondary transition-colors overflow-hidden"
                >
                  {charPreview ? (
                    <img src={charPreview} alt="Character" className="h-full w-full object-contain" />
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
                <Label htmlFor="seeNotes">SEE – What do you notice about the docks after construction? *</Label>
                <Textarea
                  id="seeNotes"
                  value={fields.seeNotes}
                  onChange={(e) => updateField("seeNotes", e.target.value)}
                  placeholder="e.g. Straight stone walls, iron gates, large enclosed water basins, cranes, organised quaysides"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sayKeywords">SAY – What does the research tell you? (key words/phrases) *</Label>
                <Textarea
                  id="sayKeywords"
                  value={fields.sayKeywords}
                  onChange={(e) => updateField("sayKeywords", e.target.value)}
                  placeholder="e.g. wet dock, lock gates, engineered walls, warehouses, cargo hoists, cobbled quayside"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="showInterpretation">SHOW – How did engineering change the waterfront? *</Label>
                <Textarea
                  id="showInterpretation"
                  value={fields.showInterpretation}
                  onChange={(e) => updateField("showInterpretation", e.target.value)}
                  placeholder="e.g. The waterfront was transformed from a natural tidal river into a controlled, industrial environment designed for efficient trade"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="finalSentence">Final Sentence – After construction, the docks were… *</Label>
                <Textarea
                  id="finalSentence"
                  value={fields.finalSentence}
                  onChange={(e) => updateField("finalSentence", e.target.value)}
                  placeholder="e.g. After construction, the docks were a vast engineered basin enclosed by stone walls, with lock gates controlling the water level and warehouses lining the quayside"
                  rows={2}
                />
              </div>

              <Button type="submit" disabled={!isValid || isLoading} className="w-full font-display text-base tracking-wide h-12">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating…</>
                ) : (
                  <><Camera className="mr-2 h-4 w-4" />Generate Environment</>
                )}
              </Button>
            </form>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">
                Generated Environment
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Landscape photographic scene with character integrated
              </p>
              <ResultPanel imageUrl={generatedImage} isLoading={isLoading} error={error} />
            </div>
            <DebugPanel prompt={debugPrompt} isOpen={debugOpen} onToggle={() => setDebugOpen(!debugOpen)} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Role5;
