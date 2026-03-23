import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import trailmakersLogo from "@/assets/trailmakers-logo.png";

interface Compulsory3Props {
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
  faceImage: string | null;
  onFaceImageChange: (img: string | null) => void;
  objectImage: string | null;
  onObjectImageChange: (img: string | null) => void;
  objectRelation: string;
  onObjectRelationChange: (v: string) => void;
}

const Compulsory3 = ({
  see, onSeeChange, say, onSayChange,
  finalSentence, onFinalSentenceChange,
  generatedImage, onGeneratedImage,
  debugPrompt, onDebugPrompt,
  faceImage, onFaceImageChange,
  objectImage, onObjectImageChange,
  objectRelation, onObjectRelationChange,
}: Compulsory3Props) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const faceInputRef = useRef<HTMLInputElement>(null);
  const objectInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (img: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 10MB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!finalSentence.trim()) {
      toast({ title: "Missing sentence", description: "Please enter the group's final sentence.", variant: "destructive" });
      return;
    }
    if (!faceImage || !objectImage) {
      toast({ title: "Images required", description: "Please upload both the face and object images.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-compulsory-fullbody", {
        body: {
          fields: { see, say, finalSentence },
          faceImageBase64: faceImage,
          objectImageBase64: objectImage,
          objectRelation,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      onGeneratedImage(data.storedUrl || data.imageUrl);
      onDebugPrompt(data.debugPrompt);
      toast({ title: "Full body generated!", description: "The composite image has been created." });
    } catch (e: any) {
      toast({ title: "Generation failed", description: e.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/compulsory")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src={trailmakersLogo} alt="Trailmakers" className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground leading-tight">Ipswich Trail Makers</h1>
            <p className="text-xs text-muted-foreground">Compulsory Task – Full Body</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/compulsory/1")} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">1. Face</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/compulsory/2")} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">2. Object</button>
            <span className="text-xs text-muted-foreground">→</span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">3. Full Body</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
            <div>
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Full Body & Appearance</h2>
              <p className="text-sm text-muted-foreground">
                Upload the face and object images, then describe the character's full appearance.
              </p>
            </div>

            {/* Image uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-display text-sm font-semibold mb-2 block">Face Image</Label>
                <input ref={faceInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, onFaceImageChange)} />
                {faceImage ? (
                  <div className="relative">
                    <img src={faceImage} alt="Face" className="w-full aspect-square object-cover rounded-lg border border-border" />
                    <button onClick={() => { onFaceImageChange(null); if (faceInputRef.current) faceInputRef.current.value = ""; }} className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-background">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => faceInputRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors text-xs">
                    <Upload className="w-5 h-5" />
                    Upload Face
                  </button>
                )}
              </div>

              <div>
                <Label className="font-display text-sm font-semibold mb-2 block">Object Image</Label>
                <input ref={objectInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, onObjectImageChange)} />
                {objectImage ? (
                  <div className="relative">
                    <img src={objectImage} alt="Object" className="w-full aspect-square object-cover rounded-lg border border-border" />
                    <button onClick={() => { onObjectImageChange(null); if (objectInputRef.current) objectInputRef.current.value = ""; }} className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-background">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => objectInputRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors text-xs">
                    <Upload className="w-5 h-5" />
                    Upload Object
                  </button>
                )}
              </div>
            </div>

            {/* Object relation */}
            <div>
              <Label className="font-display text-sm font-semibold mb-2 block">
                How should the character interact with the object?
              </Label>
              <div className="flex gap-3">
                <button
                  onClick={() => onObjectRelationChange("holding")}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors ${
                    objectRelation === "holding"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Holding the object
                </button>
                <button
                  onClick={() => onObjectRelationChange("standing-next-to")}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-colors ${
                    objectRelation === "standing-next-to"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  Standing next to it
                </button>
              </div>
            </div>

            {/* Text fields */}
            <div className="space-y-5">
              <div>
                <Label htmlFor="see" className="font-display text-sm font-semibold">
                  SEE – What clothing and appearance do you notice?
                </Label>
                <Textarea
                  id="see"
                  placeholder="e.g. Heavy boots, thick wool jacket, flat cap..."
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
                  placeholder="e.g. working clothes, sturdy, practical, weatherproof..."
                  value={say}
                  onChange={(e) => onSayChange(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sentence" className="font-display text-sm font-semibold">
                  Final Sentence – "The character is wearing..."
                </Label>
                <Textarea
                  id="sentence"
                  placeholder="The character is wearing a heavy wool jacket, thick leather boots, and a flat cap..."
                  value={finalSentence}
                  onChange={(e) => onFinalSentenceChange(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              <Button onClick={handleGenerate} disabled={loading} className="w-full font-display gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Full Body...</> : "Generate Full Body Image"}
              </Button>
            </div>
          </div>

          {/* Result */}
          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Generated Full Body</h2>
              <p className="text-sm text-muted-foreground mb-4">The composite character image will appear here</p>

              {generatedImage ? (
                <div className="space-y-4">
                  <img src={generatedImage} alt="Generated full body" className="w-full rounded-lg border border-border" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="font-display" onClick={async () => {
                      const res = await fetch(generatedImage);
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "compulsory-fullbody.png";
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
                  {loading ? "Generating..." : "Upload images, fill fields, and click Generate"}
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

        <div className="mt-8 flex justify-start">
          <Button variant="outline" onClick={() => navigate("/compulsory/2")} className="font-display gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Object
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Compulsory3;
