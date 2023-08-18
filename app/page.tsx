import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { columns } from "@/components/transactions/columns";
import { Transaction } from "@/components/transactions/schema";
import SummaryCards from "@/components/transactions/summary-cards";
import { getTransactions } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  const data = (await getTransactions()) as Transaction[];

  return (
    <main className="flex min-h-screen flex-col max-w-screen-2xl items-center mx-auto md:p-24 gap-12 p-5">
      <div className="z-10 w-full items-center justify-between font-mono text-sm flex">
        <p className="text-2xl">DoctorTable</p>
        <div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <div className="w-full flex flex-col gap-5">
        <div>
          <SummaryCards data={data} />
        </div>
        <div className="w-full flex justify-end">
          <TransactionForm />
        </div>
        <TransactionTable columns={columns} data={data} />
      </div>
    </main>
  );
}
