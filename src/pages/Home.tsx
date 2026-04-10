import { useNavigate } from "react-router-dom";
import { BookOpen, GraduationCap } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { useClassName } from "@/hooks/useClassName";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import trailmakersLogo from "@/assets/trailmakers-logo.png";
import PortalFooter from "@/components/PortalFooter";

const Home = () => {
  const navigate = useNavigate();
  const { schoolName } = useAuth();
  const { className, setClassName } = useClassName();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            <span className="block">Welcome {schoolName || "back"} to</span>
            <span className="block">IPSWICH TRAIL MAKERS</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Select a task to get started
          </p>
        </div>

        <div className="max-w-sm mx-auto mb-10 text-center">
          <Label htmlFor="className" className="text-sm font-semibold text-foreground">
            Class / Group Name
          </Label>
          <Input
            id="className"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g. 7B, Year 8 Group 2, Mrs Smith's class"
            className="mt-1 text-center"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter your class name so generated images can be tracked to your group
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
              In-Depth Study: Edward Caley
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              A five-stage historical character workflow. Build portraits, full-body characters, and environment scenes using historical evidence.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="bg-secondary px-2 py-0.5 rounded">5 Tasks</span>
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
              Create Your Trail Maker Character
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              A three-role task using historical evidence and AI image generation. Follow the worksheets to complete each role.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="bg-secondary px-2 py-0.5 rounded">3 Tasks</span>
              <span className="bg-secondary px-2 py-0.5 rounded">Portrait → Full Body Portrait</span>
            </div>
          </button>
        </div>

        <div className="flex justify-center mt-12">
          <img src={trailmakersLogo} alt="Ipswich Trail Makers" className="w-80 h-80 rounded-full object-cover" />
        </div>
      </main>
      <PortalFooter />
    </div>
  );
};

export default Home;
