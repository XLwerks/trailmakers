import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import trailmakersLogo from "@/assets/trailmakers-logo.png";

const sections = [
  {
    title: "What is Ipswich Trail Makers?",
    paragraphs: [
      "Ipswich Trail Makers invites children to discover the stories behind Ipswich's Blue Plaques.",
      "From Kavas Badshah OBE to Edith Maud Cook, Ipswich's plaques reveal remarkable stories waiting to be rediscovered.",
      "Using maps, archives and historical detective work, they explore how people from the past helped shape the town we know today.",
    ],
  },
  {
    title: "How it works",
    paragraphs: [
      "Children investigate the stories behind Ipswich's Blue Plaques.",
      "They choose a historical figure that interests them and uncover the story of their life.",
      "Using creative digital tools, they turn their research into characters and storytelling.",
      "Along the way, they explore what makes someone blue-plaque worthy.",
    ],
  },
  {
    title: "History through their eyes",
    paragraphs: [
      "Each school chooses the stories that resonate with them.",
      "Students interpret these lives in their own creative ways, exploring what these figures mean today — and asking which voices might be missing from Ipswich's story.",
      "The result is a new generation of voices connecting with Ipswich's past.",
    ],
  },
  {
    title: "Working with Ipswich schools",
    paragraphs: [
      "Schools across Ipswich are taking part in the Trail Makers programme, researching and sharing the town's stories.",
      "Together they are helping shape a new digital heritage trail for the town.",
    ],
  },
  {
    title: "A new trail for Ipswich",
    paragraphs: [
      "Students' work becomes part of a digital heritage trail across the town.",
      "Visitors will be able to explore Ipswich's Blue Plaques and discover the stories behind them through fresh creative perspectives.",
      "The trail will launch across Ipswich in Autumn 2026.",
    ],
  },
];

const PublicHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="bg-accent sticky top-0 z-10 border-b border-accent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-accent-foreground tracking-wide">
            IPSWICH TRAIL MAKERS
          </h1>
          <Button
            onClick={() => navigate("/portal")}
            className="gap-2 bg-white/20 text-white border border-white/30 hover:bg-white/30"
          >
            School Portal <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <img
            src={trailmakersLogo}
            alt="Ipswich Trail Makers"
            className="w-48 h-48 sm:w-64 sm:h-64 rounded-full object-cover mx-auto mb-8"
          />
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">
            Wolsey 550 PlaceChangers
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
            Past stories. New voices.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A new youth-led digital heritage trail for Ipswich
          </p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Launching Autumn 2026
          </p>
        </div>
      </section>

      {/* Content sections */}
      {sections.map((section, i) => (
        <section
          key={section.title}
          className={`py-16 ${i % 2 === 0 ? "bg-card" : "bg-background"}`}
        >
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h3 className="text-3xl sm:text-4xl font-bold text-primary mb-8">
              {section.title}
            </h3>
            <div className="space-y-5">
              {section.paragraphs.map((p, j) => (
                <p key={j} className="text-muted-foreground text-lg leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 text-center bg-accent">
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-accent-foreground mb-4">
            Are you an Ipswich school?
          </h3>
          <p className="text-accent-foreground/80 mb-8 text-lg">
            Access the Trail Makers platform through the School Portal.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/portal")}
            className="gap-2 bg-white text-accent hover:bg-white/90 text-lg px-8"
          >
            School Portal <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-card border-t border-border">
        <p className="text-sm text-muted-foreground">
          © 2026 Ipswich Trail Makers · Wolsey 550 PlaceChangers
        </p>
      </footer>
    </div>
  );
};

export default PublicHome;
