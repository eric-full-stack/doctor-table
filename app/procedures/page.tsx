import { DataTable } from "@/components/data-table";
import { ProcedureForm } from "@/components/procedures/ProcedureForm";
import { columns } from "@/components/procedures/columns";
import { Procedure } from "@/components/procedures/schema";
import { getProcedures } from "@/lib/db";

export default async function Home() {
  const data = (await getProcedures()) as Procedure[];

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-end">
        <ProcedureForm />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
