import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Camera, Upload } from "lucide-react";

export interface FieldLabels {
  seeLabel?: string;
  seePlaceholder?: string;
  sayLabel?: string;
  sayPlaceholder?: string;
  showLabel?: string;
  showPlaceholder?: string;
  finalLabel?: string;
  finalPlaceholder?: string;
  imageUploadLabel?: string;
  imageUploadHint?: string;
}

interface PortraitFormProps {
  onSubmit: (fields: Record<string, string>, imageBase64?: string) => void;
  isLoading: boolean;
  showImageUpload?: boolean;
  fieldLabels?: FieldLabels;
}

const defaultLabels: FieldLabels = {
  seeLabel: "SEE – Observed Visual Clues *",
  seePlaceholder: "e.g. Stern expression, deep-set eyes, weathered skin, grey hair pulled back tightly",
  sayLabel: "SAY – Key Facial Descriptors (comma separated) *",
  sayPlaceholder: "e.g. determined jaw, kind eyes, furrowed brow, thin lips, high cheekbones",
  showLabel: "SHOW – What This Suggests About the Person *",
  showPlaceholder: "e.g. A person of strong conviction who has endured hardship but remains compassionate",
  finalLabel: "Final Sentence – Core Description *",
  finalPlaceholder: "e.g. A devout Quaker woman in her 50s, known for her prison reform work in early 19th century England",
  imageUploadLabel: "Reference Image (optional)",
  imageUploadHint: "Upload a portrait photo for facial likeness",
};

const PortraitForm = ({ onSubmit, isLoading, showImageUpload = false, fieldLabels }: PortraitFormProps) => {
  const labels = { ...defaultLabels, ...fieldLabels };
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [referenceBase64, setReferenceBase64] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    seeNotes: "",
    sayKeywords: "",
    showInterpretation: "",
    finalSentence: "",
  });

  const updateField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setReferencePreview(result);
      setReferenceBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(fields, referenceBase64 || undefined);
  };

  const isValid =
    fields.seeNotes &&
    fields.sayKeywords &&
    fields.showInterpretation &&
    fields.finalSentence;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {showImageUpload && (
        <div>
          <Label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-2 block">
            {labels.imageUploadLabel}
          </Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative cursor-pointer border-2 border-dashed border-border rounded-lg h-40 flex items-center justify-center bg-secondary/50 hover:bg-secondary transition-colors overflow-hidden"
          >
            {referencePreview ? (
              <img
                src={referencePreview}
                alt="Reference"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Upload className="w-6 h-6" />
                <span className="text-sm">{labels.imageUploadHint}</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      <div>
        <Label htmlFor="seeNotes">{labels.seeLabel}</Label>
        <Textarea
          id="seeNotes"
          value={fields.seeNotes}
          onChange={(e) => updateField("seeNotes", e.target.value)}
          placeholder={labels.seePlaceholder}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="sayKeywords">{labels.sayLabel}</Label>
        <Textarea
          id="sayKeywords"
          value={fields.sayKeywords}
          onChange={(e) => updateField("sayKeywords", e.target.value)}
          placeholder={labels.sayPlaceholder}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="showInterpretation">{labels.showLabel}</Label>
        <Textarea
          id="showInterpretation"
          value={fields.showInterpretation}
          onChange={(e) => updateField("showInterpretation", e.target.value)}
          placeholder={labels.showPlaceholder}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="finalSentence">{labels.finalLabel}</Label>
        <Textarea
          id="finalSentence"
          value={fields.finalSentence}
          onChange={(e) => updateField("finalSentence", e.target.value)}
          placeholder={labels.finalPlaceholder}
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
            Generating…
          </>
        ) : (
          <>
            <Camera className="mr-2 h-4 w-4" />
            Generate Image
          </>
        )}
      </Button>
    </form>
  );
};

export default PortraitForm;
