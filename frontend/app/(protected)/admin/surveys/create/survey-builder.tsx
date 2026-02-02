"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import FieldCard from "./field-card";

export default function SurveyBuilder({ surveyId }: { surveyId: number }) {
  const [fields, setFields] = useState<any[]>([]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Survey Fields</h2>

      {fields.map((field, index) => (
        <FieldCard
          key={index}
          field={field}
          onDelete={() =>
            setFields(fields.filter((_, i) => i !== index))
          }
          surveyId={surveyId}
        />
      ))}

      <Button
        onClick={() =>
          setFields([
            ...fields,
            { label: "", field_type: "text", is_required: false, options: [] },
          ])
        }
        className="cursor-pointer"
      >
        + Add Field
      </Button>
    </div>
  );
}
