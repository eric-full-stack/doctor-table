import { procedureSchema } from "@/components/procedures/schema";
import { newProcedure } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { sql } from "@vercel/postgres";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  body.date = new Date(body.date);
  const data = procedureSchema.parse(body);
  const procedure = await newProcedure(data);

  return new Response(
    JSON.stringify({
      procedure,
    }),
    { status: 200 }
  );
}

export async function GET() {
  const { userId } = auth();
  const result =
    await sql`SELECT * FROM procedures WHERE user_id = ${userId} ORDER BY title DESC`;
  return new Response(JSON.stringify(result.rows), { status: 200 });
}
