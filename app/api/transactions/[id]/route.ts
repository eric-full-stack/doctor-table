import { payTransaction } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params;
  const body = await req.json();
  const { status } = body;

  const transaction = await payTransaction(id, status);

  revalidatePath(`/`);

  return new Response(
    JSON.stringify({
      transaction,
    }),
    { status: 200 }
  );
}
