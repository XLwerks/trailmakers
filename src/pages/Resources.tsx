import AppHeader from "@/components/AppHeader";
import { compulsoryResources, edCaleyResources } from "@/components/AppHeader";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResourceList = ({ resources }: { resources: { name: string; file: string }[] }) => (
  <div className="space-y-4">
    {resources.map((r) => (
      <div
        key={r.file}
        className="flex items-center gap-4 bg-card border border-border rounded-xl p-5 shadow-sm"
      >
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{r.name}</h3>
          <p className="text-xs text-muted-foreground">PDF Document</p>
        </div>
        <Button asChild size="sm" className="gap-1 shrink-0">
          <a
            href={`${import.meta.env.BASE_URL}resources/${r.file}`}
            download={r.file}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-4 h-4" /> Download
          </a>
        </Button>
      </div>
    ))}
  </div>
);

const Resources = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader subtitle="Teacher Resources" showHomeButton />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Teacher Resources
          </h2>
          <p className="text-muted-foreground text-lg">
            Download worksheets and support materials
          </p>
        </div>

        <Tabs defaultValue="compulsory" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="compulsory">Compulsory Task</TabsTrigger>
            <TabsTrigger value="ed-caley">Ed Caley Task</TabsTrigger>
          </TabsList>
          <TabsContent value="compulsory">
            <ResourceList resources={compulsoryResources} />
          </TabsContent>
          <TabsContent value="ed-caley">
            <ResourceList resources={edCaleyResources} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Resources;
