import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { FormFields, emptyFormFields } from "@/components/PortraitForm";
import Home from "./pages/Home";
import Role1 from "./pages/Role1";
import Role2 from "./pages/Role2";
import Role3 from "./pages/Role3";
import Role4 from "./pages/Role4";
import Role5 from "./pages/Role5";
import CompulsoryHub from "./pages/CompulsoryHub";
import Compulsory1 from "./pages/Compulsory1";
import Compulsory2 from "./pages/Compulsory2";
import Compulsory3 from "./pages/Compulsory3";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

interface RoleState {
  fields: FormFields;
  generatedImage: string | null;
  debugPrompt: string | null;
  referenceImage: string | null;
}

const emptyRoleState: RoleState = {
  fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] },
  generatedImage: null,
  debugPrompt: null,
  referenceImage: null,
};

interface Role4_5State {
  fields: FormFields;
  generatedImage: string | null;
  debugPrompt: string | null;
  charImage: string | null;
  timePeriod: string;
}

const emptyRole4_5State: Role4_5State = {
  fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] },
  generatedImage: null,
  debugPrompt: null,
  charImage: null,
  timePeriod: "",
};

const AppRoutes = () => {
  const [timePeriod, setTimePeriod] = useState<string>("");

  const [role1, setRole1] = useState<RoleState>({ ...emptyRoleState, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });
  const [role2, setRole2] = useState<RoleState>({ ...emptyRoleState, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });
  const [role3, setRole3] = useState<RoleState>({ ...emptyRoleState, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });
  const [role4, setRole4] = useState<Role4_5State>({ ...emptyRole4_5State, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });
  const [role5, setRole5] = useState<Role4_5State>({ ...emptyRole4_5State, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });

  // Compulsory task state
  const [comp1, setComp1] = useState({ see: "", say: "", finalSentence: "", generatedImage: null as string | null, debugPrompt: null as string | null });
  const [comp2, setComp2] = useState({ see: "", say: "", finalSentence: "", generatedImage: null as string | null, debugPrompt: null as string | null });
  const [comp3, setComp3] = useState({ see: "", say: "", finalSentence: "", generatedImage: null as string | null, debugPrompt: null as string | null, faceImage: null as string | null, objectImage: null as string | null, objectRelation: "holding" });

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/ed-caley"
        element={
          <Role1
            timePeriod={timePeriod}
            onTimePeriodChange={setTimePeriod}
            fields={role1.fields}
            onFieldsChange={(f) => setRole1((s) => ({ ...s, fields: f }))}
            generatedImage={role1.generatedImage}
            onGeneratedImage={(url) => setRole1((s) => ({ ...s, generatedImage: url }))}
            debugPrompt={role1.debugPrompt}
            onDebugPrompt={(p) => setRole1((s) => ({ ...s, debugPrompt: p }))}
          />
        }
      />
      <Route
        path="/ed-caley/role2"
        element={
          <Role2
            timePeriod={timePeriod}
            fields={role2.fields}
            onFieldsChange={(f) => setRole2((s) => ({ ...s, fields: f }))}
            generatedImage={role2.generatedImage}
            onGeneratedImage={(url) => setRole2((s) => ({ ...s, generatedImage: url }))}
            debugPrompt={role2.debugPrompt}
            onDebugPrompt={(p) => setRole2((s) => ({ ...s, debugPrompt: p }))}
            referenceImage={role2.referenceImage}
            onReferenceImageChange={(img) => setRole2((s) => ({ ...s, referenceImage: img }))}
          />
        }
      />
      <Route
        path="/ed-caley/role3"
        element={
          <Role3
            timePeriod={timePeriod}
            fields={role3.fields}
            onFieldsChange={(f) => setRole3((s) => ({ ...s, fields: f }))}
            generatedImage={role3.generatedImage}
            onGeneratedImage={(url) => setRole3((s) => ({ ...s, generatedImage: url }))}
            debugPrompt={role3.debugPrompt}
            onDebugPrompt={(p) => setRole3((s) => ({ ...s, debugPrompt: p }))}
            referenceImage={role3.referenceImage}
            onReferenceImageChange={(img) => setRole3((s) => ({ ...s, referenceImage: img }))}
          />
        }
      />
      <Route
        path="/ed-caley/role4"
        element={
          <Role4
            timePeriod={role4.timePeriod}
            onTimePeriodChange={(tp) => setRole4((s) => ({ ...s, timePeriod: tp }))}
            fields={role4.fields}
            onFieldsChange={(f) => setRole4((s) => ({ ...s, fields: f }))}
            generatedImage={role4.generatedImage}
            onGeneratedImage={(url) => setRole4((s) => ({ ...s, generatedImage: url }))}
            debugPrompt={role4.debugPrompt}
            onDebugPrompt={(p) => setRole4((s) => ({ ...s, debugPrompt: p }))}
            charImage={role4.charImage}
            onCharImageChange={(img) => setRole4((s) => ({ ...s, charImage: img }))}
          />
        }
      />
      <Route
        path="/ed-caley/role5"
        element={
          <Role5
            timePeriod={role5.timePeriod}
            onTimePeriodChange={(tp) => setRole5((s) => ({ ...s, timePeriod: tp }))}
            fields={role5.fields}
            onFieldsChange={(f) => setRole5((s) => ({ ...s, fields: f }))}
            generatedImage={role5.generatedImage}
            onGeneratedImage={(url) => setRole5((s) => ({ ...s, generatedImage: url }))}
            debugPrompt={role5.debugPrompt}
            onDebugPrompt={(p) => setRole5((s) => ({ ...s, debugPrompt: p }))}
            charImage={role5.charImage}
            onCharImageChange={(img) => setRole5((s) => ({ ...s, charImage: img }))}
          />
        }
      />
      <Route path="/compulsory" element={<CompulsoryHub />} />
      <Route path="/compulsory/1" element={<Compulsory1 />} />
      <Route path="/compulsory/2" element={<Compulsory2 />} />
      <Route path="/compulsory/3" element={<Compulsory3 />} />
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
