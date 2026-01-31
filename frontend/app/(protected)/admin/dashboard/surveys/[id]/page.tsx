"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SurveyViewPage() {
  const params = useParams();
  const [survey, setSurvey] = useState<any>(null);

  console.log("Survey ID from params:", params.id);

  useEffect(() => {
    api.get(`/surveys/${params.id}`).then((res) => setSurvey(res.data));
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

          {field.field_type === "radio" && (
            <RadioGroup defaultValue="option-one">
              {field.field_options.map((opt: any) => {
                console.log("Radio Option:", opt);
                return (
                  <div className="flex items-center gap-3" key={opt.id}>
                    <RadioGroupItem value={opt.value} id={opt.id} />
                    <Label htmlFor={opt.id}>{opt.label}</Label>
                  </div>
                );
              })}

              <div className="flex items-center gap-3">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Option Two</Label>
              </div>
            </RadioGroup>
          )}

          {field.field_type === "select" && (
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="select ..." />
              </SelectTrigger>
              <SelectContent>
                {field.field_options.map((opt: any) => {
                  console.log("Radio Option:", opt);
                  return <SelectItem value={opt.value} key={opt.id}>{opt.label}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
    </div>
  );
}
