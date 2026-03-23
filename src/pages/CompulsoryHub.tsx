import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompulsoryHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-accent backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-accent-foreground/70 hover:text-accent-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-accent-foreground leading-tight">IPSWICH TRAIL MAKERS</h1>
            <p className="text-xs text-muted-foreground">Compulsory Task</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/compulsory/1")} className="text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors cursor-pointer">Page 1</button>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/compulsory/2")} className="text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors cursor-pointer">Page 2</button>
            <span className="text-xs text-accent-foreground/50">→</span>
            <button onClick={() => navigate("/compulsory/3")} className="text-xs text-accent-foreground/70 hover:text-accent-foreground transition-colors cursor-pointer">Page 3</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Compulsory Task</h2>
        <p className="text-muted-foreground mb-8">Complete three stages using historical evidence and AI image generation.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigate("/compulsory/1")} className="font-display">
            Start Page 1
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CompulsoryHub;
