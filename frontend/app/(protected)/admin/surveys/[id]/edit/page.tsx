"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface FieldOption {
  label: string;
  value: string;
}

interface SurveyField {
  id: number;
  label: string;
  field_type: string;
  is_required: boolean;
  field_options: { id: number; label: string; value: string }[];
}

interface Survey {
  id: number;
  title: string;
  description: string | null;
  survey_fields: SurveyField[];
}

export default function EditSurveyPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fieldsReordered, setFieldsReordered] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/admin/surveys/${params.id}`);
        setSurvey(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || "");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/surveys/${params.id}`, {
        title,
        description: description || null,
      });

      // If fields were reordered, save the new order
      if (fieldsReordered && survey) {
        const fieldOrders = survey.survey_fields.map((field, index) => ({
          id: field.id,
          order_index: index,
        }));
        await api.put(`/admin/surveys/${params.id}/fields/reorder`, {
          fieldOrders,
        });
      }

      toast({
        title: "Survey Updated",
        description: "Your changes have been saved successfully.",
      });
      router.push("/admin/surveys");
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
         toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message ,
      });
      }
      else{
        toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update survey",
      });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteField = async (fieldId: number) => {
    if (!confirm("Are you sure you want to delete this field?")) return;
    try {
      await api.delete(`/admin/surveys/fields/${fieldId}`);
      // Refresh survey data
      const res = await api.get(`/admin/surveys/${params.id}`);
      setSurvey(res.data);
      toast({
        title: "Field Deleted",
        description: "The field has been removed from the survey.",
      });
    } catch (err: unknown) {
      console.error(err);
       if (axios.isAxiosError(err)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.response?.data?.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete field",
        });
      }
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!survey || draggedIndex === null || draggedIndex === dropIndex) return;

    const updated = { ...survey };
    const fields = [...updated.survey_fields];
    const [draggedField] = fields.splice(draggedIndex, 1);
    fields.splice(dropIndex, 0, draggedField);
    updated.survey_fields = fields;
    setSurvey(updated);
    setDraggedIndex(null);
    setFieldsReordered(true);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveFieldUp = (index: number) => {
    if (!survey || index === 0) return;
    const updated = { ...survey };
    const fields = [...updated.survey_fields];
    [fields[index - 1], fields[index]] = [fields[index], fields[index - 1]];
    updated.survey_fields = fields;
    setSurvey(updated);
    setFieldsReordered(true);
  };

  const moveFieldDown = (index: number) => {
    if (!survey || index === survey.survey_fields.length - 1) return;
    const updated = { ...survey };
    const fields = [...updated.survey_fields];
    [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
    updated.survey_fields = fields;
    setSurvey(updated);
    setFieldsReordered(true);
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
        <div className="text-center space-y-3">
          <p className="text-red-500">Survey not found</p>
          <Link href="/admin/surveys">
            <Button variant="outline" className="cursor-pointer">Back to Surveys</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/admin/surveys">
          <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
            Back to Surveys
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Edit Survey</h1>
          <Button onClick={handleSave} disabled={saving || !title} className="gap-2 cursor-pointer">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Survey Details */}
      <div className="space-y-4 bg-card border rounded-lg p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Survey Title *</Label>
          <Input
            id="title"
            placeholder="Enter survey title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Enter survey description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Fields Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Survey Fields</h2>
            <p className="text-sm text-muted-foreground">
              Manage the fields in your survey
            </p>
          </div>
          <Link href={`/admin/surveys/${params.id}`}>
            <Button variant="outline" className="gap-2 cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </Link>
        </div>

        {survey.survey_fields.length === 0 ? (
          <div className="bg-card border rounded-lg p-12 text-center space-y-3">
            <p className="text-muted-foreground">No fields added yet</p>
            <Link href={`/admin/surveys/${params.id}`}>
              <Button variant="outline" className="gap-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                Add Your First Field
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {survey.survey_fields.map((field, index) => (
              <div
                key={field.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-card border rounded-lg p-4 hover:shadow-md transition-all ${
                  draggedIndex === index ? "opacity-50 scale-95" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <GripVertical className="h-5 w-5 cursor-grab active:cursor-grabbing" />
                    <span className="text-sm font-medium">#{index + 1}</span>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-semibold">{field.label}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                            {field.field_type}
                          </span>
                          {field.is_required && (
                            <span className="text-red-600">Required</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFieldUp(index)}
                          disabled={index === 0}
                          title="Move up"
                          className="cursor-pointer"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveFieldDown(index)}
                          disabled={index === survey.survey_fields.length - 1}
                          title="Move down"
                          className="cursor-pointer"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteField(field.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          title="Delete field"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {field.field_options.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Options:</p>
                        <div className="flex flex-wrap gap-2">
                          {field.field_options.map((option) => (
                            <span
                              key={option.id}
                              className="text-xs px-2 py-1 rounded-md bg-muted"
                            >
                              {option.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
