import { z } from "zod";

const loginSchema = z.object({
  kennitala: z.string().length(10, "Sláðu inn gilda kennitölu"),
});

const staffSchema = z.object({
  name: z.string().min(3),
  phone: z.string(),
  team: z.string(),
  status: z.string(),
});

export { loginSchema, staffSchema };
