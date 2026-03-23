import { useNavigate } from "react-router-dom";
import { Home, LogOut, Settings, FileText, Download, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const compulsoryResources = [
  { name: "Classroom Support Notes", file: "classroom-support-notes.pdf" },
  { name: "Role 1 – Face Worksheet", file: "role-1-face-worksheet.pdf" },
  { name: "Role 2 – Object Worksheet", file: "role-2-object-worksheet.pdf" },
  { name: "Role 3 – Full Body Worksheet", file: "role-3-full-body-worksheet.pdf" },
  { name: "Group Form", file: "group-form-compulsory.pdf" },
];

export const edCaleyResources = [
  { name: "Role 1 Worksheet", file: "caley-role-1.pdf" },
  { name: "Role 2 Worksheet", file: "caley-role-2.pdf" },
  { name: "Role 3 Worksheet", file: "caley-role-3.pdf" },
  { name: "Role 4 Worksheet", file: "caley-role-4.pdf" },
  { name: "Role 5 Worksheet", file: "caley-role-5.pdf" },
  { name: "Form – Landscape", file: "caley-form-landscape.pdf" },
  { name: "Teacher Prompt Sheet", file: "caley-teacher-prompt-sheet.pdf" },
  { name: "Research Information Sheet", file: "caley-research-information-sheet.pdf" },
];

interface ResourceDropdownProps {
  label: string;
  resources: { name: string; file: string }[];
}

const ResourceDropdown = ({ label, resources }: ResourceDropdownProps) => {
  const navigate = useNavigate();
  const basePath = import.meta.env.BASE_URL;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className="gap-1 bg-white/20 text-white border border-white/30 hover:bg-white/30"
        >
          <FileText className="w-4 h-4" /> {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {resources.map((r) => (
          <DropdownMenuItem key={r.file} asChild>
            <a
              href={`${basePath}resources/${r.file}`}
              download={r.file}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
              {r.name}
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => navigate("/resources")}
          className="flex items-center gap-2 border-t mt-1 pt-1"
        >
          <FileText className="w-4 h-4 text-muted-foreground" />
          View All Resources
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface AppHeaderProps {
  subtitle?: string;
  showHomeButton?: boolean;
}

const AppHeader = ({ subtitle, showHomeButton = false }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { signOut, isAdmin, schoolName, teacherName } = useAuth();

  const displaySubtitle = subtitle || (schoolName
    ? `${schoolName}${teacherName ? ` — ${teacherName}` : ""}`
    : "Choose your task pathway");

  return (
    <header className="border-b border-accent bg-accent backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
        {showHomeButton && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-accent-foreground/80 hover:text-accent-foreground hover:bg-white/10"
          >
            <Home className="w-5 h-5" />
          </Button>
        )}

        <div className="flex-1">
          <h1 className="font-display text-xl font-bold text-accent-foreground leading-tight">
            IPSWICH TRAIL MAKERS
          </h1>
          <p className="text-xs text-accent-foreground/70">{displaySubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <ResourceDropdown label="Compulsory" resources={compulsoryResources} />
          <ResourceDropdown label="Ed Caley" resources={edCaleyResources} />

          {isAdmin && (
            <Button
              size="sm"
              onClick={() => navigate("/admin")}
              className="gap-1 bg-white/20 text-white border border-white/30 hover:bg-white/30"
            >
              <Settings className="w-4 h-4" /> Admin
            </Button>
          )}
          <Button
            size="sm"
            onClick={signOut}
            className="gap-1 bg-transparent text-white/80 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
