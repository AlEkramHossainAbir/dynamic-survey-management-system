const { z } = require("zod");

// Schema for creating a survey
const createSurveySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").nullable().optional(),
});

// Schema for updating a survey
const updateSurveySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(1000, "Description must be less than 1000 characters").nullable().optional(),
});

// Schema for field options
const fieldOptionSchema = z.object({
  label: z.string().min(1, "Option label is required").max(100, "Option label too long"),
  value: z.string().min(1, "Option value is required").max(100, "Option value too long"),
});

// Schema for adding a field to a survey
const addFieldSchema = z.object({
  label: z.string().min(1, "Field label is required").max(150, "Field label too long"),
  field_type: z.enum(["text", "textarea", "checkbox", "radio", "select"], {
    errorMap: () => ({ message: "Invalid field type" }),
  }),
  is_required: z.boolean().optional().default(false),
  options: z.array(fieldOptionSchema).optional().default([]),
}).refine(
  (data) => {
    // If field type needs options, ensure options array is not empty
    if (["checkbox", "radio", "select"].includes(data.field_type)) {
      return data.options && data.options.length > 0;
    }
    return true;
  },
  {
    message: "Options are required for checkbox, radio, and select field types",
    path: ["options"],
  }
);

// Schema for updating a field
const updateFieldSchema = z.object({
  label: z.string().min(1, "Field label is required").max(150, "Field label too long"),
  is_required: z.boolean().optional(),
  options: z.array(fieldOptionSchema).optional(),
});

// Schema for survey submission answer
const submissionAnswerSchema = z.object({
  field_id: z.number().int().positive("Invalid field ID"),
  value: z.string().min(0, "Answer value is required"),
});

// Schema for submitting a survey
const submitSurveySchema = z.object({
  answers: z.array(submissionAnswerSchema).min(1, "At least one answer is required"),
});

// Schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

module.exports = {
  createSurveySchema,
  updateSurveySchema,
  addFieldSchema,
  updateFieldSchema,
  submitSurveySchema,
  loginSchema,
};
