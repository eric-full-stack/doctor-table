import { z } from "zod";

export const procedureSchema = z.object({
  id: z.string().nullish(),
  title: z.string().min(4),
  amount: z.number(),
  user_id: z.string().min(4),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
});

export type Procedure = z.infer<typeof procedureSchema>;
