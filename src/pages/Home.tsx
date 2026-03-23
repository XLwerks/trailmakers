import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";


const Home = () => {
  const navigate = useNavigate();
  const { signOut, isAdmin, schoolName, teacherName } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-accent bg-accent backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-accent-foreground leading-tight">
              IPSWICH TRAIL MAKERS
            </h1>
            <p className="text-xs text-accent-foreground/70">
              {schoolName ? `${schoolName}${teacherName ? ` — ${teacherName}` : ""}` : "Choose your task pathway"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")} className="gap-1">
                <Settings className="w-4 h-4" /> Admin
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={signOut} className="gap-1 text-muted-foreground">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome to IPSWICH TRAIL MAKERS
          </h2>
          <p className="text-muted-foreground text-lg">
            Select a task to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => navigate("/ed-caley")}
            className="group bg-card rounded-xl border border-border p-8 shadow-sm hover:shadow-md hover:border-primary/50 transition-all text-left cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Ed Caley Task
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              A five-stage historical character workflow. Build portraits, full-body characters, and environment scenes using historical evidence.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="bg-secondary px-2 py-0.5 rounded">5 Roles</span>
              <span className="bg-secondary px-2 py-0.5 rounded">Portrait → Environment</span>
            </div>
          </button>

          <button
            onClick={() => navigate("/compulsory")}
            className="group bg-card rounded-xl border border-border p-8 shadow-sm hover:shadow-md hover:border-primary/50 transition-all text-left cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-accent/50 flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
              <GraduationCap className="w-7 h-7 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Compulsory Task
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              A three-stage task using historical evidence and AI image generation. Follow the worksheets to complete each stage.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="bg-secondary px-2 py-0.5 rounded">3 Pages</span>
              <span className="bg-secondary px-2 py-0.5 rounded">Worksheet-guided</span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
