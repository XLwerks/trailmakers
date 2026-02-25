import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Role1 from "./pages/Role1";
import Role2 from "./pages/Role2";
import Role3 from "./pages/Role3";
import Role4 from "./pages/Role4";
import Role5 from "./pages/Role5";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [portraitImageUrl, setPortraitImageUrl] = useState<string | null>(null);
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<string>("");

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Role1
            onPortraitGenerated={setPortraitImageUrl}
            generatedPortrait={portraitImageUrl}
            timePeriod={timePeriod}
            onTimePeriodChange={setTimePeriod}
          />
        }
      />
      <Route
        path="/role2"
        element={<Role2 portraitImageUrl={portraitImageUrl} timePeriod={timePeriod} />}
      />
      <Route
        path="/role3"
        element={<Role3 portraitImageUrl={portraitImageUrl} timePeriod={timePeriod} />}
      />
      <Route
        path="/role4"
        element={<Role4 characterImageUrl={characterImageUrl} timePeriod={timePeriod} />}
      />
      <Route
        path="/role5"
        element={<Role5 characterImageUrl={characterImageUrl} timePeriod={timePeriod} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
