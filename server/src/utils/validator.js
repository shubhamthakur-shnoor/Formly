import { z } from "zod";

export const registerSchema = z.object({ //for the registration (Admin)
  full_name: z.string().min(2),
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(8),
});
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(1).max(72),
});

export const questionSchema = z.object({
  question_text: z.string().trim().min(1).max(1000),
  question_type: z.enum([
    "MULTIPLE_CHOICE",
    "RATING",
    "SHORT_ANSWER",
    "LONG_ANSWER",
  ]),
  is_required: z.boolean().default(false),
  question_order: z.number().int().positive(),
  options: z.array(z.string().trim().min(1).max(255)).default([]),
}).superRefine((data, ctx) => {
  if (
    data.question_type === "MULTIPLE_CHOICE" &&
    data.options.length < 2
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["options"],
      message: "Multiple-choice questions need at least 2 options",
    });
  }

  if (
    data.question_type !== "MULTIPLE_CHOICE" &&
    data.options.length > 0
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["options"],
      message: "Options are only allowed for multiple-choice questions",
    });
  }
});

export const surveyStatusSchema = z.object({
  status: z.enum(["PUBLISHED", "CLOSED"]),
});

export const submitResponseSchema = z.object({
  respondent_name: z.string().trim().min(1).max(100).optional(),
  respondent_email: z.string().trim().email().max(255).optional(),
  respondent_token: z.string().trim().min(16).max(200).optional(),
  answers: z.array(
    z.object({
      question_id: z.coerce.number().int().positive(),
      selected_option_id: z.coerce.number().int().positive().optional(),
      rating_score: z.coerce.number().int().min(1).max(5).optional(),
      text_answer: z.string().trim().max(10000).optional(),
    })
  ).min(1),
});
