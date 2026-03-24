import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { FormFields, emptyFormFields } from "@/components/PortraitForm";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Login from "./pages/Login";
import PublicHome from "./pages/PublicHome";
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
import Admin from "./pages/Admin";
import Resources from "./pages/Resources";
import HowToUse from "./pages/HowToUse";
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
  const { user, loading } = useAuth();
  const [timePeriod, setTimePeriod] = useState<string>("");

  const [role1, setRole1] = useState<RoleState>({ ...emptyRoleState, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });
  const [role2, setRole2] = useState<RoleState>({ ...emptyRoleState, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });
  const [role3, setRole3] = useState<RoleState>({ ...emptyRoleState, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });
  const [role4, setRole4] = useState<Role4_5State>({ ...emptyRole4_5State, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });
  const [role5, setRole5] = useState<Role4_5State>({ ...emptyRole4_5State, fields: { ...emptyFormFields, keywords: [...emptyFormFields.keywords] } });

  const [comp1, setComp1] = useState({ see: "", say: "", finalSentence: "", generatedImage: null as string | null, debugPrompt: null as string | null });
  const [comp2, setComp2] = useState({ see: "", say: "", finalSentence: "", generatedImage: null as string | null, debugPrompt: null as string | null });
  const [comp3, setComp3] = useState({ see: "", say: "", finalSentence: "", generatedImage: null as string | null, debugPrompt: null as string | null, faceImage: null as string | null, objectImage: null as string | null, objectRelation: "holding" });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/portal" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/how-to-use" element={<HowToUse />} />
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
      <Route path="/compulsory" element={
        <Compulsory1
          see={comp1.see} onSeeChange={(v) => setComp1(s => ({ ...s, see: v }))}
          say={comp1.say} onSayChange={(v) => setComp1(s => ({ ...s, say: v }))}
          finalSentence={comp1.finalSentence} onFinalSentenceChange={(v) => setComp1(s => ({ ...s, finalSentence: v }))}
          generatedImage={comp1.generatedImage} onGeneratedImage={(url) => setComp1(s => ({ ...s, generatedImage: url }))}
          debugPrompt={comp1.debugPrompt} onDebugPrompt={(p) => setComp1(s => ({ ...s, debugPrompt: p }))}
        />
      } />
      <Route path="/compulsory/1" element={
        <Compulsory1
          see={comp1.see} onSeeChange={(v) => setComp1(s => ({ ...s, see: v }))}
          say={comp1.say} onSayChange={(v) => setComp1(s => ({ ...s, say: v }))}
          finalSentence={comp1.finalSentence} onFinalSentenceChange={(v) => setComp1(s => ({ ...s, finalSentence: v }))}
          generatedImage={comp1.generatedImage} onGeneratedImage={(url) => setComp1(s => ({ ...s, generatedImage: url }))}
          debugPrompt={comp1.debugPrompt} onDebugPrompt={(p) => setComp1(s => ({ ...s, debugPrompt: p }))}
        />
      } />
      <Route path="/compulsory/2" element={
        <Compulsory2
          see={comp2.see} onSeeChange={(v) => setComp2(s => ({ ...s, see: v }))}
          say={comp2.say} onSayChange={(v) => setComp2(s => ({ ...s, say: v }))}
          finalSentence={comp2.finalSentence} onFinalSentenceChange={(v) => setComp2(s => ({ ...s, finalSentence: v }))}
          generatedImage={comp2.generatedImage} onGeneratedImage={(url) => setComp2(s => ({ ...s, generatedImage: url }))}
          debugPrompt={comp2.debugPrompt} onDebugPrompt={(p) => setComp2(s => ({ ...s, debugPrompt: p }))}
        />
      } />
      <Route path="/compulsory/3" element={
        <Compulsory3
          see={comp3.see} onSeeChange={(v) => setComp3(s => ({ ...s, see: v }))}
          say={comp3.say} onSayChange={(v) => setComp3(s => ({ ...s, say: v }))}
          finalSentence={comp3.finalSentence} onFinalSentenceChange={(v) => setComp3(s => ({ ...s, finalSentence: v }))}
          generatedImage={comp3.generatedImage} onGeneratedImage={(url) => setComp3(s => ({ ...s, generatedImage: url }))}
          debugPrompt={comp3.debugPrompt} onDebugPrompt={(p) => setComp3(s => ({ ...s, debugPrompt: p }))}
          faceImage={comp3.faceImage} onFaceImageChange={(img) => setComp3(s => ({ ...s, faceImage: img }))}
          objectImage={comp3.objectImage} onObjectImageChange={(img) => setComp3(s => ({ ...s, objectImage: img }))}
          objectRelation={comp3.objectRelation} onObjectRelationChange={(v) => setComp3(s => ({ ...s, objectRelation: v }))}
        />
      } />
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
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
