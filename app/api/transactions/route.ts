import { transactionSchema } from "@/components/transactions/schema";
import { getTransactions, newTransaction } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  body.date = new Date(body.date);
  const data = transactionSchema.parse(body);
  const transaction = await newTransaction(data);

  return new Response(
    JSON.stringify({
      transaction,
    }),
    { status: 200 }
  );
}

export async function GET() {
  const { userId } = auth();
  const result = await sql`
    SELECT
      transactions.id,
      transactions.title,
      transactions.status,
      transactions.amount,
      procedures.title AS procedure,
      agreements.title AS agreement,
      transactions.assistant,
      transactions.user_id,
      transactions.date,
      transactions.createdAt,
      transactions.updatedAt
    FROM transactions
    INNER JOIN procedures ON transactions.procedure_id = procedures.id
    INNER JOIN agreements ON transactions.agreement_id = agreements.id
    WHERE transactions.user_id = ${userId}
    ORDER BY date DESC`;
  return new Response(JSON.stringify(result.rows), { status: 200 });
}
