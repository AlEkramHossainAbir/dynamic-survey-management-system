"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SurveyBuilder from "./survey-builder";

export default function CreateSurveyPage() {
  const [surveyId, setSurveyId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createSurvey = async () => {
    const res = await api.post("/surveys", { title, description });
    setSurveyId(res.data.id);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Survey</h1>

      {!surveyId && (
        <div className="space-y-3 max-w-xl">
          <Input
            placeholder="Survey title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button onClick={createSurvey}>Save & Continue</Button>
        </div>
      )}

      {surveyId && <SurveyBuilder surveyId={surveyId} />}
    </div>
  );
}
