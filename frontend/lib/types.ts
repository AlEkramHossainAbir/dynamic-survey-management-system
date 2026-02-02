export interface Survey {
  id: number;
  title: string;
  description: string | null;
  created_at: string;
  survey_fields: SurveyField[];
}

export interface SurveyField {
  id: number;
  label: string;
  field_type: string;
  is_required: boolean;
  field_options: FieldOption[];
}

export interface FieldOption {
  id: number;
  label: string;
  value: string;
}

export interface NewFieldOption {
  label: string;
  value: string;
}

export interface NewField {
  label: string;
  field_type: string;
  is_required: boolean;
  options: NewFieldOption[];
}