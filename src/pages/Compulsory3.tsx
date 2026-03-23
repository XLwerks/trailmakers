import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import trailmakersLogo from "@/assets/trailmakers-logo.png";

const Compulsory3 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/compulsory")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold text-foreground leading-tight">Trailmakers Ai</h1>
            <p className="text-xs text-muted-foreground">Compulsory Task – Page 3</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/compulsory/1")} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Page 1</button>
            <span className="text-xs text-muted-foreground">→</span>
            <button onClick={() => navigate("/compulsory/2")} className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Page 2</button>
            <span className="text-xs text-muted-foreground">→</span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Page 3</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Page 3 – Coming Soon</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This page will be configured based on the worksheet requirements.
            </p>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground">
              Form fields will go here
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 flex-1">
              <h2 className="font-display text-lg font-semibold mb-1 text-foreground">Generated Image</h2>
              <p className="text-sm text-muted-foreground mb-6">Output will appear here</p>
              <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-muted-foreground">
                Image result placeholder
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-start">
          <Button variant="outline" onClick={() => navigate("/compulsory/2")} className="font-display gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Page 2
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Compulsory3;
