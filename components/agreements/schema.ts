import { z } from "zod";

export const agreementSchema = z.object({
  id: z.string().nullish(),
  title: z.string().min(4),
  multiplier: z.string(),
  user_id: z.string().min(4),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
});

export type Agreement = z.infer<typeof agreementSchema>;
