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