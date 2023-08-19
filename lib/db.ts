import { Agreement } from "@/components/agreements/schema";
import { Procedure } from "@/components/procedures/schema";
import { Transaction } from "@/components/transactions/schema";
import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";
import { format } from "date-fns";

export async function getProcedures() {
  const { getToken } = auth();
  const token = await getToken();
  const result = await fetch(`${process.env.BASE_URL}/api/procedures`, {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await result.json();

  return data;
}

export async function newProcedure(data: Procedure) {
  if (typeof window === "undefined") {
    const { title, amount, user_id } = data;
    const result =
      await sql`INSERT INTO procedures (user_id, title, amount) VALUES (${user_id}, ${title}, ${amount}) RETURNING *`;
    return result.rows[0];
  } else {
    const result = await fetch("/api/procedures", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.json();
  }
}

export async function getAgreements() {
  const { getToken } = auth();
  const token = await getToken();
  const result = await fetch(`${process.env.BASE_URL}/api/agreements`, {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await result.json();

  return data;
}

export async function newAgreement(data: Agreement) {
  if (typeof window === "undefined") {
    const { title, multiplier, user_id } = data;
    const result =
      await sql`INSERT INTO agreements (user_id, title, multiplier) VALUES (${user_id}, ${title}, ${multiplier}) RETURNING *`;
    return result.rows[0];
  } else {
    const result = await fetch("/api/agreements", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.json();
  }
}

export async function getTransactions() {
  const { getToken } = auth();
  const token = await getToken();
  const result = await fetch(`${process.env.BASE_URL}/api/transactions`, {
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
      await sql`INSERT INTO transactions (user_id, title, status, amount, procedure_id, assistant, agreement_id, date) VALUES (${user_id}, ${title}, ${status}, ${amount}, ${procedure}, ${assistant}, ${agreement}, ${format(
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
