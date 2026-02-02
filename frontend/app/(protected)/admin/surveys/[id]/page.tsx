"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
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
  BarChart3,
  Edit,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { NewField, Survey, SurveyField, FieldOption } from "@/lib/types";


export default function SurveyDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFields, setNewFields] = useState<NewField[]>([]);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
  }, [params.id, refreshKey]);

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
    // Filter out empty fields
    const validFields = newFields.filter(field => field.label.trim() !== '');
    
    if (validFields.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add at least one field with a label",
      });
      return;
    }

    setSaving(true);
    try {
      // Add all fields
      await Promise.all(
        validFields.map(field => 
          api.post(`/admin/surveys/${params.id}/fields`, field)
        )
      );
      
      // Clear new fields first
      setNewFields([]);
      
      // Refresh survey data by triggering useEffect
      setRefreshKey(prev => prev + 1);
      
      toast({
        title: "Success",
        description: `${validFields.length} field(s) have been added to the survey.`,
      });
    } catch (err: unknown) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to save fields",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 w-full">
      <div className="p-8 space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="space-y-6">
          <Link href="/admin/surveys">
            <Button variant="ghost" size="sm" className="gap-2 cursor-pointer hover:bg-accent">
              <ChevronLeft className="h-4 w-4" />
              Back to Surveys
            </Button>
          </Link>

          <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-8 shadow-sm">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-2 flex-1">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {survey.title}
                </h1>
                {survey.description && (
                  <p className="text-muted-foreground text-lg">{survey.description}</p>
                )}
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href={`/admin/surveys/${params.id}/edit`}>
                  <Button variant="outline" className="gap-2 cursor-pointer hover:bg-accent">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/admin/surveys/${params.id}/submissions`}>
                  <Button variant="default" className="gap-2 cursor-pointer">
                    <BarChart3 className="h-4 w-4" />
                    Submissions
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Fields */}
        {survey.survey_fields.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <h2 className="text-2xl font-semibold">Existing Fields</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <div className="space-y-4">
              {survey.survey_fields.map((field: SurveyField, index: number) => (
                <div
                  key={field.id}
                  className="bg-card/80 backdrop-blur-sm border rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {index + 1}
                      </span>
                      <Label className="text-lg font-semibold">
                        {field.label}
                        {field.is_required && (
                          <span className="text-red-500 ml-1.5 text-base">*</span>
                        )}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 ml-11">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs uppercase tracking-wide">
                        {field.field_type}
                      </span>
                      {field.is_required && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-500/10 text-red-600 font-medium text-xs">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Field Preview */}
                <div className="pt-4 border-t ml-11">
                  {field.field_type === "text" && (
                    <Input placeholder="Text input preview" disabled className="bg-muted/50" />
                  )}
                  {field.field_type === "textarea" && (
                    <Textarea placeholder="Textarea preview" disabled rows={3} className="bg-muted/50" />
                  )}
                  {field.field_type === "checkbox" &&
                    field.field_options.map((opt: FieldOption) => (
                      <div key={opt.id} className="flex items-center gap-2 mb-2">
                        <Checkbox disabled />
                        <Label>{opt.label}</Label>
                      </div>
                    ))}
                  {field.field_type === "radio" && (
                    <RadioGroup disabled>
                      {field.field_options.map((opt: FieldOption) => (
                        <div
                          key={opt.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={opt.value} id={String(opt.id)} />
                          <Label htmlFor={String(opt.id)}>{opt.label}</Label>
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
                        {field.field_options.map((opt: FieldOption) => (
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <h2 className="text-2xl font-semibold">
                {survey.survey_fields.length > 0 ? "Add More Fields" : "Add Fields"}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <Button onClick={addField} size="lg" className="gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all">
              <Plus className="h-5 w-5" />
              Add Field
            </Button>
          </div>

          {newFields.length === 0 && survey.survey_fields.length === 0 && (
            <div className="bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-sm border-2 border-dashed rounded-2xl p-16 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No Fields Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start building your survey by adding your first field. Click the &quot;Add Field&quot; button above.
                </p>
              </div>
            </div>
          )}

          {newFields.map((field, index) => (
            <div key={index} className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-xl p-6 space-y-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {survey.survey_fields.length + index + 1}
                  </span>
                  <h3 className="text-lg font-semibold">New Field</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
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
    </div>
  );
}
