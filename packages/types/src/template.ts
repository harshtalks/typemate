export type TemplateVariableType = "string" | "number" | "date" | "boolean";

export interface TemplateVariable {
  name: string;
  type: TemplateVariableType;
  required: boolean;
  description?: string;
}

export type TemplateVariableSchema = TemplateVariable[];

export type TemplateVersionStatus = "draft" | "published";
