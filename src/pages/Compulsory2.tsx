import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useClassName } from "@/hooks/useClassName";

interface Compulsory2Props {
  see: string;
  onSeeChange: (v: string) => void;
  say: string;
  onSayChange: (v: string) => void;
  finalSentence: string;
  onFinalSentenceChange: (v: string) => void;
  generatedImage: string | null;
  onGeneratedImage: (url: string) => void;
  debugPrompt: string | null;
  onDebugPrompt: (p: string) => void;
}

const Compulsory2 = ({
  see, onSeeChange, say, onSayChange,
  finalSentence, onFinalSentenceChange,
  generatedImage, onGeneratedImage,
  debugPrompt, onDebugPrompt,
}: Compulsory2Props) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { className } = useClassName();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!finalSentence.trim()) {
      toast({ title: "Missing sentence", description: "Please enter the group's final sentence.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-compulsory-object", {
        body: { fields: { see, say, finalSentence }, className },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      onGeneratedImage(data.storedUrl || data.imageUrl);
      onDebugPrompt(data.debugPrompt);
      toast({ title: "Object generated!", description: "The object image has been created." });
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
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
            <p className="text-xs text-accent-foreground/70">Compulsory Task – Object</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/compulsory/1")} className="text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors cursor-pointer">1. Face</button>
            <span className="text-xs text-accent-foreground/50">→</span>
            <span className="text-xs font-semibold text-accent-foreground bg-accent-foreground/20 px-2 py-1 rounded">2. Object</span>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/compulsory/3")} className="text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors cursor-pointer">3. Full Body</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Character Object</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Enter the group's observations and descriptive sentence to generate the character's important object.
            </p>

            <div className="space-y-5">
              <div>
                <Label htmlFor="see" className="font-display text-sm font-semibold">
                  SEE – What objects do you notice?
                </Label>
                <Textarea
                  id="see"
                  placeholder="e.g. Tools, ropes, wooden crates, iron hooks..."
                  value={see}
                  onChange={(e) => onSeeChange(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="say" className="font-display text-sm font-semibold">
                  SAY – Words or phrases from the research text
                </Label>
                <Textarea
                  id="say"
                  placeholder="e.g. cargo hook, well-worn, iron, essential tool..."
                  value={say}
                  onChange={(e) => onSayChange(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sentence" className="font-display text-sm font-semibold">
                  Final Sentence – "The object is..."
                </Label>
                <Textarea
                  id="sentence"
                  placeholder="The object is a heavy iron cargo hook, worn smooth from years of use at the docks..."
                  value={finalSentence}
                  onChange={(e) => onFinalSentenceChange(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <Button onClick={handleGenerate} disabled={loading} className="w-full font-display gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Object...</> : "Generate Object Image"}
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Generated Object</h2>
              <p className="text-sm text-muted-foreground mb-4">The AI-generated object will appear here</p>

              {generatedImage ? (
                <div className="space-y-4">
                  <img src={generatedImage} alt="Generated object" className="w-full rounded-lg border border-border" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="font-display" onClick={async () => {
                      const res = await fetch(generatedImage);
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "compulsory-object.png";
                      a.click();
                      URL.revokeObjectURL(url);
                    }}>Download</Button>
                    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={loading} className="font-display">
                      Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground text-sm">
                  {loading ? "Generating..." : "Fill in the fields and click Generate"}
                </div>
              )}

              {debugPrompt && (
                <details className="mt-4">
                  <summary className="text-xs text-muted-foreground cursor-pointer">Debug: View prompt</summary>
                  <pre className="mt-2 text-xs bg-muted p-3 rounded-lg overflow-auto max-h-40 whitespace-pre-wrap">{debugPrompt}</pre>
                </details>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => navigate("/compulsory/1")} className="font-display gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Face
          </Button>
          <Button onClick={() => navigate("/compulsory/3")} className="font-display gap-2">
            Proceed to Full Body <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Compulsory2;
