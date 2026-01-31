"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Radio } from "lucide-react";

export default function OfficerSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [answers, setAnswers] = useState({}); // { fieldId: value }

  const fetchSurveys = async () => {
    try {
      const res = await api.get(`/officer/surveys`);
      setSurveys(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  

  const handleChange = (fieldId, value) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async surveyId => {
    try {
      const payload = Object.entries(answers).map(([field_id, value]) => ({
        field_id: parseInt(field_id),
        value,
      }));

      await api.post(`/officer/surveys/${surveyId}/submit`, { answers: payload });
      alert("Survey submitted successfully!");
      setAnswers({});
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submission failed");
    }
  };
  
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Officer Surveys</h1>

      {surveys.map(survey => (
        <div key={survey.id} className="p-4 border rounded-md space-y-4">
          <h2 className="text-xl font-semibold">{survey.title}</h2>
          <p>{survey.description}</p>

          {survey.survey_fields.map(field => (
            <div key={field.id} className="space-y-2">
              <label className="block font-medium">{field.label} {field.is_required && "*"}</label>

              {field.field_type === "text" && (
                <Input
                  value={answers[field.id] || ""}
                  onChange={e => handleChange(field.id, e.target.value)}
                />
              )}

              {field.field_type === "radio" && (
                <RadioGroup
                  value={answers[field.id] || ""}
                  onValueChange={value => handleChange(field.id, value)}
                  className="flex space-x-4"
                >
                  {field.field_options.map(option => (
                    <Radio key={option.id} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </div>
          ))}

          <Button onClick={() => handleSubmit(survey.id)}>Submit Survey</Button>
        </div>
      ))}
      </div>
    </div>
  );
}
