"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FieldCard({ field, onDelete, surveyId }: any) {
  const [data, setData] = useState(field);

  const hasOptions = ["checkbox", "radio", "select"].includes(data.field_type);

  const saveField = async () => {
    await api.post(`/surveys/${surveyId}/fields`, data);
  };

  return (
    <div className="border p-4 rounded space-y-3">
      <Input
        placeholder="Field label"
        value={data.label}
        onChange={(e) => setData({ ...data, label: e.target.value })}
      />

      <Select
        value={data.field_type}
        onValueChange={(v) =>
          setData({ ...data, field_type: v, options: [] })
        }
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="checkbox">Checkbox</SelectItem>
          <SelectItem value="radio">Radio</SelectItem>
          <SelectItem value="select">Select</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={data.is_required}
          onCheckedChange={(v) =>
            setData({ ...data, is_required: Boolean(v) })
          }
        />
        Required
      </div>

      {hasOptions && (
        <div className="space-y-2">
          {data.options.map((opt: any, i: number) => (
            <Input
              key={i}
              placeholder="Option"
              value={opt.label}
              onChange={(e) => {
                const options = [...data.options];
                options[i].label = e.target.value;
                options[i].value = e.target.value;
                setData({ ...data, options });
              }}
            />
          ))}
          <Button
            variant="outline"
            onClick={() =>
              setData({
                ...data,
                options: [...data.options, { label: "", value: "" }],
              })
            }
            className="cursor-pointer"
          >
            + Add Option
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button onClick={saveField} className="cursor-pointer">Save Field</Button>
        <Button variant="destructive" onClick={onDelete} className="cursor-pointer">
          Remove
        </Button>
      </div>
    </div>
  );
}
