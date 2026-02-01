"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  GripVertical,
  Loader2,
  Save,
  ChevronLeft,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface FieldOption {
  label: string;
  value: string;
}

interface Field {
  label: string;
  field_type: string;
  is_required: boolean;
  options: FieldOption[];
}

export default function CreateSurveyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addField = () => {
    setFields([
      ...fields,
      { label: "", field_type: "text", is_required: false, options: [] },
    ]);
  };

  const updateField = (index: number, updates: Partial<Field>) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    setFields(updated);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const addOption = (fieldIndex: number) => {
    const updated = [...fields];
    updated[fieldIndex].options.push({ label: "", value: "" });
    setFields(updated);
  };

  const updateOption = (
    fieldIndex: number,
    optionIndex: number,
    label: string
  ) => {
    const updated = [...fields];
    updated[fieldIndex].options[optionIndex] = { label, value: label };
    setFields(updated);
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const updated = [...fields];
    updated[fieldIndex].options = updated[fieldIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFields(updated);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Survey title is required";
    }

    fields.forEach((field, index) => {
      if (!field.label.trim()) {
        newErrors[`field-${index}-label`] = "Field label is required";
      }
      if (["checkbox", "radio", "select"].includes(field.field_type)) {
        if (field.options.length === 0) {
          newErrors[`field-${index}-options`] = "At least one option is required";
        } else if (field.options.some((opt) => !opt.label.trim())) {
          newErrors[`field-${index}-options`] = "All options must have labels";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors before submitting.",
      });
      return;
    }

    setSaving(true);
    try {
      // Create survey
      const surveyRes = await api.post("/admin/surveys", {
        title,
        description: description || null,
      });
      const surveyId = surveyRes.data.id;

      // Save all fields
      for (const field of fields) {
        await api.post(`/admin/surveys/${surveyId}/fields`, field);
      }

      toast({
        title: "Survey Created",
        description: `"${title}" has been created successfully.`,
      });

      router.push("/admin/dashboard/surveys");
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to create survey. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const hasOptions = (type: string) =>
    ["checkbox", "radio", "select"].includes(type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/admin/dashboard/surveys">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Surveys
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Create New Survey</h1>
              <p className="text-muted-foreground">
                Design your survey by adding a title, description, and fields
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={saving || !title || fields.length === 0}
              size="lg"
              className="gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Survey
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Survey Details */}
        <div className="bg-card border rounded-lg shadow-sm p-6 space-y-5">
          <div className="space-y-1.5">
            <h2 className="text-lg font-semibold">Survey Details</h2>
            <p className="text-sm text-muted-foreground">
              Provide basic information about your survey
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center gap-1">
                Survey Title
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Employee Satisfaction Survey 2026"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    const newErrors = { ...errors };
                    delete newErrors.title;
                    setErrors(newErrors);
                  }
                }}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Provide additional context about this survey..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Fields Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Survey Fields</h2>
              <p className="text-sm text-muted-foreground">
                Add questions and fields to collect responses
              </p>
            </div>
            <Button onClick={addField} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="bg-card border-2 border-dashed rounded-lg p-12 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">No fields added yet</p>
                <p className="text-sm text-muted-foreground">
                  Click &quot;Add Field&quot; to start building your survey
                </p>
              </div>
              <Button onClick={addField} variant="outline" className="gap-2 mt-4">
                <Plus className="h-4 w-4" />
                Add Your First Field
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Field Header */}
                  <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      Field {index + 1}
                    </span>
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Field Content */}
                  <div className="p-5 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`field-${index}-label`}>
                          Field Label
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id={`field-${index}-label`}
                          placeholder="e.g., What is your department?"
                          value={field.label}
                          onChange={(e) => {
                            updateField(index, { label: e.target.value });
                            if (errors[`field-${index}-label`]) {
                              const newErrors = { ...errors };
                              delete newErrors[`field-${index}-label`];
                              setErrors(newErrors);
                            }
                          }}
                          className={
                            errors[`field-${index}-label`] ? "border-red-500" : ""
                          }
                        />
                        {errors[`field-${index}-label`] && (
                          <p className="text-sm text-red-500">
                            {errors[`field-${index}-label`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`field-${index}-type`}>Field Type</Label>
                        <Select
                          value={field.field_type}
                          onValueChange={(value) =>
                            updateField(index, {
                              field_type: value,
                              options: [],
                            })
                          }
                        >
                          <SelectTrigger id={`field-${index}-type`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Input</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="radio">Radio Button</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`field-${index}-required`}
                        checked={field.is_required}
                        onCheckedChange={(checked) =>
                          updateField(index, { is_required: Boolean(checked) })
                        }
                      />
                      <Label
                        htmlFor={`field-${index}-required`}
                        className="font-normal cursor-pointer"
                      >
                        Required field
                      </Label>
                    </div>

                    {/* Options for checkbox, radio, select */}
                    {hasOptions(field.field_type) && (
                      <div className="space-y-3 pt-3 border-t">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Options
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(index)}
                            className="gap-1.5 h-8"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Option
                          </Button>
                        </div>

                        {field.options.length === 0 ? (
                          <div className="text-center py-4 border-2 border-dashed rounded-md">
                            <p className="text-sm text-muted-foreground">
                              No options added. Click &quot;Add Option&quot; to start.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
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
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {errors[`field-${index}-options`] && (
                          <p className="text-sm text-red-500">
                            {errors[`field-${index}-options`]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        {fields.length > 0 && (
          <div className="sticky bottom-6 bg-card border rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">{fields.length}</span> field
                {fields.length !== 1 ? "s" : ""} added
              </div>
              <div className="flex gap-2">
                <Link href="/admin/dashboard/surveys">
                  <Button variant="outline" disabled={saving}>
                    Cancel
                  </Button>
                </Link>
                <Button
                  onClick={handleSave}
                  disabled={saving || !title || fields.length === 0}
                  className="gap-2 min-w-[140px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Survey
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
