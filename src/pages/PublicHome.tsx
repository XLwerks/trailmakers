import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import trailmakersLogo from "@/assets/trailmakers-logo.png";
import wolseyGateBg from "@/assets/wolsey-gate-bg.jpg";
import partnerLogos from "@/assets/partner-logos.png";
import wolseyLogo from "@/assets/wolsey-550-logo.png";
import iconCat from "@/assets/icon-cat.png";
import iconClover from "@/assets/icon-clover.png";
import iconPeacock from "@/assets/icon-peacock.png";
import iconRaven from "@/assets/icon-raven.png";
import iconRose from "@/assets/icon-rose.png";

const sections = [
  {
    id: "about",
    navLabel: "About",
    title: "What is Ipswich Trail Makers?",
    paragraphs: [
      "Ipswich Trail Makers invites children to discover the stories behind Ipswich's Blue Plaques.",
      "From Kavas Badshah OBE to Edith Maud Cook, Ipswich's plaques reveal remarkable stories waiting to be rediscovered.",
      "Using maps, archives and historical detective work, they explore how people from the past helped shape the town we know today.",
    ],
  },
  {
    id: "how-it-works",
    navLabel: "How It Works",
    title: "How it works",
    paragraphs: [
      "Children investigate the stories behind Ipswich's Blue Plaques.",
      "They choose a historical figure that interests them and uncover the story of their life.",
      "Using creative digital tools, they turn their research into characters and storytelling.",
      "Along the way, they explore what makes someone blue-plaque worthy.",
    ],
  },
  {
    id: "history",
    navLabel: "",
    title: "History through their eyes",
    paragraphs: [
      "Each school chooses the stories that resonate with them.",
      "Students interpret these lives in their own creative ways, exploring what these figures mean today — and asking which voices might be missing from Ipswich's story.",
      "The result is a new generation of voices connecting with Ipswich's past.",
    ],
  },
  {
    id: "schools",
    navLabel: "Schools",
    title: "Working with Ipswich schools",
    paragraphs: [
      "Schools across Ipswich are taking part in the Trail Makers programme, researching and sharing the town's stories.",
      "Together they are helping shape a new digital heritage trail for the town.",
    ],
  },
  {
    id: "new-trail",
    navLabel: "The Trail",
    title: "A new trail for Ipswich",
    paragraphs: [
      "Students' work becomes part of a digital heritage trail across the town.",
      "Visitors will be able to explore Ipswich's Blue Plaques and discover the stories behind them through fresh creative perspectives.",
      "The trail will launch across Ipswich in Autumn 2026.",
    ],
  },
];

const sectionIcons = [iconCat, iconClover, iconPeacock, iconRaven, iconRose];

const PublicHome = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${wolseyGateBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-[#651114]" style={{ backgroundColor: '#651114' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <img src={wolseyLogo} alt="Wolsey 550" className="h-20 sm:h-24 w-auto" />
          <div className="flex items-center gap-1 sm:gap-3">
            {sections.filter((s) => s.navLabel).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="hidden sm:inline-block text-base font-semibold text-accent-foreground/70 hover:text-accent-foreground px-3 py-2 rounded hover:bg-white/10 transition-colors"
              >
                {s.navLabel}
              </a>
            ))}
            <Button
              onClick={() => navigate("/portal")}
              className="gap-2 bg-white/20 text-white border border-white/30 hover:bg-white/30 ml-2 text-base px-6 py-3"
            >
              School Portal <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 sm:py-24 text-center">
        <div className="absolute inset-0 bg-background/65" />
        <div className="relative max-w-3xl mx-auto px-4">
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
          id={section.id}
          className={`relative py-16 scroll-mt-16`}
        >
          {/* Odd sections get solid background, even sections show brick through */}
          <div className={`absolute inset-0 ${i % 2 === 0 ? "bg-background/85" : "bg-background/65"}`} />
          <div className="relative max-w-2xl mx-auto px-4 text-center">
            {i === 0 && (
              <img src={partnerLogos} alt="Partner logos" className="mb-10 -mt-8 w-full opacity-90" />
            )}
            <div className="flex items-center justify-center gap-4 mb-8">
              <img src={sectionIcons[i]} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <h3 className="text-3xl sm:text-4xl font-bold text-primary">
                {section.title}
              </h3>
              <img src={sectionIcons[i]} alt="" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            </div>
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
      <section className="py-20 text-center" style={{ backgroundColor: '#651114' }}>
        <div className="max-w-2xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-accent-foreground mb-4">
            Are you a registered Trail Makers school?
          </h3>
          <p className="text-accent-foreground/80 mb-8 text-lg">
            The School Portal is exclusively for schools signed up to the Ipswich Trail Makers programme. Log in to access the platform and creative tools.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/portal")}
            className="gap-2 bg-white text-accent hover:bg-white/90 text-lg px-8"
          >
            School Portal <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-accent-foreground/70 text-sm mt-6">
            Our first cohort of schools is now confirmed.
          </p>
          <p className="text-accent-foreground/70 text-sm mt-2">
            For more information contact Hannah Houghton at{" "}
            <a href="mailto:hannah@wolsey550.co.uk" className="underline text-accent-foreground hover:text-white">
              hannah@wolsey550.co.uk
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-card border-t border-border">
        <img src={partnerLogos} alt="Partner logos" className="max-w-3xl w-full mx-auto mb-4 opacity-80" />
        <p className="text-sm text-muted-foreground">
          © 2026 Ipswich Trail Makers · Wolsey 550 PlaceChangers
        </p>
      </footer>
    </div>
  );
};

export default PublicHome;
