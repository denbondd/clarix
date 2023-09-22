import React from "react";
import { Input, InputProps } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea, TextareaProps } from "./ui/textarea";

interface Labeled {
  label?: string,
  description?: string
}

export interface LabeledInputProps
  extends InputProps, Labeled { }

const LabeledInput: React.FC<LabeledInputProps> = ({ label, description, ...inputProps }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      {description && <div className="text-sm text-muted-foreground">{description}</div>}
      <Input {...inputProps} />
    </div>
  );
}

export interface LabeledTextareaProps
  extends TextareaProps, Labeled { }

const LabeledTextarea: React.FC<LabeledTextareaProps> = ({ label, description, ...textareaProps }) => {
  return (
    <div>
      {label && <Label>{label}</Label>}
      {description && <div className="text-sm text-muted-foreground">{description}</div>}
      <Textarea {...textareaProps} />
    </div>
  );
}

export { LabeledInput, LabeledTextarea }