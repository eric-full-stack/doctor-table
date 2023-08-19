import { Agreement } from "@/components/agreements/schema";
import { DataTable } from "@/components/data-table";
import HomeMenu from "@/components/home-menu";
import { Procedure } from "@/components/procedures/schema";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { columns } from "@/components/transactions/columns";
import { Transaction } from "@/components/transactions/schema";
import SummaryCards from "@/components/transactions/summary-cards";
import { getAgreements, getProcedures, getTransactions } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  const data = (await getTransactions()) as Transaction[];
  const procedures = (await getProcedures()) as Procedure[];
  const agreements = (await getAgreements()) as Agreement[];

  return (
    <div className="w-full flex flex-col gap-5">
      <div>
        <SummaryCards data={data} />
      </div>
      <div className="w-full flex justify-end">
        <TransactionForm procedures={procedures} agreements={agreements} />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
