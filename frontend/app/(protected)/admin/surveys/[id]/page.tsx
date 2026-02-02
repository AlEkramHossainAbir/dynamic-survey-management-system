"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams, useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  Eye,
  BarChart3,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface FieldOption {
  label: string;
  value: string;
}

interface NewField {
  label: string;
  field_type: string;
  is_required: boolean;
  options: FieldOption[];
}

export default function SurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newFields, setNewFields] = useState<NewField[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/surveys/${params.id}`);
        setSurvey(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [params.id]);

  const addField = () => {
    setNewFields([
      ...newFields,
      { label: "", field_type: "text", is_required: false, options: [] },
    ]);
  };

  const updateField = (index: number, updates: Partial<NewField>) => {
    const updated = [...newFields];
    updated[index] = { ...updated[index], ...updates };
    setNewFields(updated);
  };

  const removeField = (index: number) => {
    setNewFields(newFields.filter((_, i) => i !== index));
  };

  const addOption = (fieldIndex: number) => {
    const updated = [...newFields];
    updated[fieldIndex].options.push({ label: "", value: "" });
    setNewFields(updated);
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    label: string
  ) => {
    const updated = [...newFields];
    updated[fieldIndex].options[optionIndex] = { label, value: label };
    setNewFields(updated);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const updated = [...newFields];
    updated[fieldIndex].options = updated[fieldIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setNewFields(updated);
  };

  const saveFields = async () => {
    setSaving(true);
    try {
      for (const field of newFields) {
        if (!field.label) continue;
        await api.post(`/admin/surveys/${params.id}/fields`, field);
      }
      // Refresh survey
      const res = await api.get(`/admin/surveys/${params.id}`);
      setSurvey(res.data);
      setNewFields([]);
      toast({
        title: "Fields Added",
        description: `${newFields.length} field(s) have been added to the survey.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to save fields",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Survey not found</p>
      </div>
    );
  }

  const hasOptions = (type: string) =>
    ["checkbox", "radio", "select"].includes(type);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/admin/surveys">
          <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
            Back to Surveys
          </Button>
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{survey.title}</h1>
            {survey.description && (
              <p className="text-muted-foreground">{survey.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/surveys/${params.id}/edit`}>
              <Button variant="outline" className="gap-2 cursor-pointer">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Link href={`/admin/surveys/${params.id}/submissions`}>
              <Button variant="outline" className="gap-2 cursor-pointer">
                <BarChart3 className="h-4 w-4" />
                Submissions
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Existing Fields */}
      {survey.survey_fields.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Existing Fields</h2>
          <div className="space-y-3">
            {survey.survey_fields.map((field: any, index: number) => (
              <div
                key={field.id}
                className="bg-card border rounded-lg p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Q{index + 1}
                      </span>
                      <Label className="text-base font-semibold">
                        {field.label}
                        {field.is_required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                        {field.field_type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Field Preview */}
                <div className="pt-3 border-t">
                  {field.field_type === "text" && (
                    <Input placeholder="Text input preview" disabled />
                  )}
                  {field.field_type === "textarea" && (
                    <Textarea placeholder="Textarea preview" disabled rows={3} />
                  )}
                  {field.field_type === "checkbox" &&
                    field.field_options.map((opt: any) => (
                      <div key={opt.id} className="flex items-center gap-2 mb-2">
                        <Checkbox disabled />
                        <Label>{opt.label}</Label>
                      </div>
                    ))}
                  {field.field_type === "radio" && (
                    <RadioGroup disabled>
                      {field.field_options.map((opt: any) => (
                        <div
                          key={opt.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={opt.value} id={opt.id} />
                          <Label htmlFor={opt.id}>{opt.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  {field.field_type === "select" && (
                    <Select disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.field_options.map((opt: any) => (
                          <SelectItem key={opt.id} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Fields */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {survey.survey_fields.length > 0 ? "Add More Fields" : "Add Fields"}
          </h2>
          <Button onClick={addField} variant="outline" className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            Add Field
          </Button>
        </div>

        {newFields.length === 0 && survey.survey_fields.length === 0 && (
          <div className="bg-card border rounded-lg p-12 text-center space-y-3">
            <p className="text-muted-foreground">
              No fields added yet. Start by adding your first field.
            </p>
          </div>
        )}

        {newFields.map((field, index) => (
          <div key={index} className="bg-card border rounded-lg p-5 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">New Field #{index + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeField(index)}
                className="text-red-600 hover:text-red-700 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Field Label *</Label>
                <Input
                  placeholder="e.g., What is your name?"
                  value={field.label}
                  onChange={(e) =>
                    updateField(index, { label: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Field Type</Label>
                <Select
                  value={field.field_type}
                  onValueChange={(value) =>
                    updateField(index, { field_type: value, options: [] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="select">Select</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`required-${index}`}
                checked={field.is_required}
                onCheckedChange={(checked) =>
                  updateField(index, { is_required: Boolean(checked) })
                }
              />
              <Label htmlFor={`required-${index}`} className="font-normal">
                Required field
              </Label>
            </div>

            {/* Options for checkbox, radio, select */}
            {hasOptions(field.field_type) && (
              <div className="space-y-3 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(index)}
                    className="gap-2 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Add Option
                  </Button>
                </div>
                {field.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex gap-2">
                    <Input
                      placeholder={`Option ${optIndex + 1}`}
                      value={option.label}
                      onChange={(e) =>
                        updateOption(index, optIndex, e.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index, optIndex)}
                      className="text-red-600 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {newFields.length > 0 && (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setNewFields([])}
              disabled={saving}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={saveFields} disabled={saving} className="gap-2 cursor-pointer">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Fields
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
