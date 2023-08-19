import { DataTable } from "@/components/data-table";
import { AgreementForm } from "@/components/agreements/AgreementForm";
import { columns } from "@/components/agreements/columns";
import { Agreement } from "@/components/agreements/schema";
import { getAgreements } from "@/lib/db";

export default async function Home() {
  const data = (await getAgreements()) as Agreement[];

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex justify-end">
        <AgreementForm />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
