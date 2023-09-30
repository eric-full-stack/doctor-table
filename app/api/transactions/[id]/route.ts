import { updateTransaction } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";

export async function PUT(req: Request) {
  const body = await req.json();

  const transaction = await updateTransaction(body);

  revalidatePath(`/`);

  return new Response(
    JSON.stringify({
      transaction,
    }),
    { status: 200 }
  );
}

export async function GET(
  req: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  const { userId } = auth();
  const result = await sql`
    SELECT
      transactions.id,
      transactions.title,
      transactions.status,
      transactions.amount,
      procedures.id AS procedure_id,
      agreements.id AS agreement_id,
      transactions.assistant,
      transactions.user_id,
      transactions.date,
      transactions.createdAt,
      transactions.updatedAt
    FROM transactions
    INNER JOIN procedures ON transactions.procedure_id = procedures.id
    INNER JOIN agreements ON transactions.agreement_id = agreements.id
    WHERE transactions.user_id = ${userId} AND
    transactions.id = ${id}
    LIMIT 1
    `;
  return new Response(JSON.stringify(result.rows[0]), { status: 200 });
}
