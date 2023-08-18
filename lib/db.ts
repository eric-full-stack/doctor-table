import { Transaction } from "@/components/transactions/schema";
import { auth, useAuth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { format } from "date-fns";

export async function getTransactions() {
  const { getToken } = auth();
  const token = await getToken();
  const result = await fetch("http://localhost:3000/api/transactions", {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await result.json();

  return data;
}

export async function payTransaction(id: number, status: string) {
  if (typeof window === "undefined") {
    const result =
      status === "paid"
        ? await sql`UPDATE transactions SET status = 'pending' WHERE id = ${id} RETURNING *`
        : await sql`UPDATE transactions SET status = 'paid' WHERE id = ${id} RETURNING *`;

    return result.rows[0];
  } else {
    const result = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
    return await result.json();
  }
}

export async function newTransaction(data: Transaction) {
  if (typeof window === "undefined") {
    const {
      title,
      status,
      amount,
      procedure,
      assistant,
      agreement,
      date,
      user_id,
    } = data;
    const result =
      await sql`INSERT INTO transactions (user_id, title, status, amount, procedure, assistant, agreement, date) VALUES (${user_id}, ${title}, ${status}, ${amount}, ${procedure}, ${assistant}, ${agreement}, ${format(
        date,
        "yyyy-MM-dd"
      )}) RETURNING *`;
    return result.rows[0];
  } else {
    const result = await fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.json();
  }
}
