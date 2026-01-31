"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";

export default function SurveyViewPage() {
    const params = useParams();
  const [survey, setSurvey] = useState<any>(null);

  console.log("Survey ID from params:", params.id);

  useEffect(() => {
    api.get(`/surveys/${params.id}`).then(res => setSurvey(res.data));
  }, []);

  if (!survey) return null;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{survey.title}</h1>
      <p>{survey.description}</p>

      {survey.survey_fields.map((field: any) => (
        <div key={field.id} className="space-y-2">
          <label className="font-medium">{field.label}</label>

          {field.field_type === "text" && <Input />}

          {field.field_type === "checkbox" &&
            field.field_options.map((opt: any) => (
              <div key={opt.id} className="flex gap-2">
                <Checkbox /> {opt.label}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
