import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import trailmakersLogo from "@/assets/trailmakers-logo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

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
              <span className="bg-secondary px-2 py-0.5 rounded">Portrait → Historic Scene</span>
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
              A three-role task using historical evidence and AI image generation. Follow the worksheets to complete each role.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="bg-secondary px-2 py-0.5 rounded">3 Roles</span>
              <span className="bg-secondary px-2 py-0.5 rounded">Portrait → Full Body Portrait</span>
            </div>
          </button>
        </div>

        <div className="flex justify-center mt-12">
          <img src={trailmakersLogo} alt="Ipswich Trail Makers" className="w-80 h-80 rounded-full object-cover" />
        </div>
      </main>
    </div>
  );
};

export default Home;
