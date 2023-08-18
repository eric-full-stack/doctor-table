import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().nullish(),
  title: z.string().min(4),
  status: z.string().min(4),
  amount: z.number().min(0),
  procedure: z.string().min(4),
  assistant: z.boolean(),
  agreement: z.string().min(4),
  user_id: z.string().min(4),
  date: z.date(),
  createdAt: z.date().nullish(),
  updatedAt: z.date().nullish(),
});

export type Transaction = z.infer<typeof transactionSchema>;
