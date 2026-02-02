"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams, useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Survey } from "@/lib/types";

export default function SurveySubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchSurvey = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/officer/surveys/${params.id}`);
        setSurvey(res.data);
      } catch (err) {
        console.error(err);
        setSubmitError("Failed to load survey");
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [params.id]);

  const handleInputChange = (fieldId: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (
    fieldId: number,
    optionValue: string,
    checked: boolean,
  ) => {
    const currentValues = (answers[fieldId] as string[]) || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v) => v !== optionValue);
    handleInputChange(fieldId, newValues);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<number, string> = {};

    survey?.survey_fields.forEach((field) => {
      if (field.is_required) {
        const answer = answers[field.id];
        if (
          !answer ||
          (Array.isArray(answer) && answer.length === 0) ||
          answer === ""
        ) {
          newErrors[field.id] = "This field is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSubmitError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = Object.entries(answers).map(([field_id, value]) => ({
        field_id: parseInt(field_id),
        value: Array.isArray(value) ? value.join(", ") : value,
      }));

      await api.post(`/officer/surveys/${params.id}/submit`, {
        answers: payload,
      });
      setSubmitSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/officer/surveys");
      }, 2000);
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setSubmitError(err.response?.data?.message);
      } else {
        setSubmitError("Failed to submit survey. Please try again.");
      }
    } finally {
      setSubmitting(false);
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
        <div className="text-center space-y-3">
          <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
          <p className="text-red-500">Survey not found</p>
          <Link href="/officer/surveys">
            <Button variant="outline" className="cursor-pointer">
              Back to Surveys
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Survey Submitted!</h2>
            <p className="text-muted-foreground">
              Thank you for completing the survey. Your response has been
              recorded.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Redirecting you back to surveys...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 w-full">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/officer/surveys">
            <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
              Back to Surveys
            </Button>
          </Link>

          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight">
              {survey.title}
            </h1>
            {survey.description && (
              <p className="text-muted-foreground mt-2">{survey.description}</p>
            )}
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {survey.survey_fields.length} questions
              </span>
              <span>•</span>
              <span>
                {survey.survey_fields.filter((f) => f.is_required).length}{" "}
                required
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-red-900">Submission Error</p>
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4">
          {survey.survey_fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-card rounded-lg border p-6 shadow-sm space-y-3 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <Label
                  htmlFor={`field-${field.id}`}
                  className="text-base font-semibold"
                >
                  <span className="text-muted-foreground mr-2">
                    Q{index + 1}.
                  </span>
                  {field.label}
                  {field.is_required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
              </div>

              {/* Text Input */}
              {field.field_type === "text" && (
                <Input
                  id={`field-${field.id}`}
                  placeholder="Enter your answer"
                  value={(answers[field.id] as string) || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={errors[field.id] ? "border-red-500" : ""}
                />
              )}

              {/* Textarea */}
              {field.field_type === "textarea" && (
                <Textarea
                  id={`field-${field.id}`}
                  placeholder="Enter your answer"
                  value={(answers[field.id] as string) || ""}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={errors[field.id] ? "border-red-500" : ""}
                  rows={4}
                />
              )}

              {/* Checkbox */}
              {field.field_type === "checkbox" && (
                <div className="space-y-3">
                  {field.field_options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={`option-${option.id}`}
                        checked={
                          (answers[field.id] as string[])?.includes(
                            option.value,
                          ) || false
                        }
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            field.id,
                            option.value,
                            checked as boolean,
                          )
                        }
                      />
                      <Label
                        htmlFor={`option-${option.id}`}
                        className="font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              )}

              {/* Radio */}
              {field.field_type === "radio" && (
                <RadioGroup
                  value={(answers[field.id] as string) || ""}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                  className="space-y-3"
                >
                  {field.field_options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`option-${option.id}`}
                      />
                      <Label
                        htmlFor={`option-${option.id}`}
                        className="font-normal cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {/* Select */}
              {field.field_type === "select" && (
                <Select
                  value={(answers[field.id] as string) || ""}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                >
                  <SelectTrigger
                    className={errors[field.id] ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.field_options.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Error Message */}
              {errors[field.id] && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="sticky bottom-6 bg-card rounded-lg border p-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Please review your answers before submitting
            </p>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              size="lg"
              className="min-w-[140px] cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Survey"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
