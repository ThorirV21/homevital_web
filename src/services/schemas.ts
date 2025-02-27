import { z } from "zod";

const loginSchema = z.object({
  kennitala: z.string().length(10, "Sláðu inn gilda kennitölu"),
});

export { loginSchema };
