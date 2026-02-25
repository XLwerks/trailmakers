import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Camera } from "lucide-react";

interface PortraitFormProps {
  onSubmit: (fields: Record<string, string>) => void;
  isLoading: boolean;
}

const PortraitForm = ({ onSubmit, isLoading }: PortraitFormProps) => {
  const [fields, setFields] = useState({
    seeNotes: "",
    sayKeywords: "",
    showInterpretation: "",
    finalSentence: "",
  });

  const updateField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(fields);
  };

  const isValid =
    fields.seeNotes &&
    fields.sayKeywords &&
    fields.showInterpretation &&
    fields.finalSentence;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="seeNotes">
          SEE – Observed Visual Clues *
        </Label>
        <Textarea
          id="seeNotes"
          value={fields.seeNotes}
          onChange={(e) => updateField("seeNotes", e.target.value)}
          placeholder="e.g. Stern expression, deep-set eyes, weathered skin, grey hair pulled back tightly"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="sayKeywords">
          SAY – Key Facial Descriptors (comma separated) *
        </Label>
        <Textarea
          id="sayKeywords"
          value={fields.sayKeywords}
          onChange={(e) => updateField("sayKeywords", e.target.value)}
          placeholder="e.g. determined jaw, kind eyes, furrowed brow, thin lips, high cheekbones"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="showInterpretation">
          SHOW – What This Suggests About the Person *
        </Label>
        <Textarea
          id="showInterpretation"
          value={fields.showInterpretation}
          onChange={(e) => updateField("showInterpretation", e.target.value)}
          placeholder="e.g. A person of strong conviction who has endured hardship but remains compassionate"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="finalSentence">
          Final Sentence – Core Description *
        </Label>
        <Textarea
          id="finalSentence"
          value={fields.finalSentence}
          onChange={(e) => updateField("finalSentence", e.target.value)}
          placeholder="e.g. A devout Quaker woman in her 50s, known for her prison reform work in early 19th century England"
          rows={2}
        />
      </div>

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full font-display text-base tracking-wide h-12"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Portrait…
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Generate Portrait
          </>
        )}
      </Button>
    </form>
  );
};

export default PortraitForm;
