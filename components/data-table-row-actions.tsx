"use client";

import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { DollarSign, Edit } from "lucide-react";
import { payTransaction } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const handlePayTransaction = async () => {
    try {
      const { transaction } = await payTransaction(
        row.getValue("id"),
        row.getValue("status")
      );
      toast({
        title: "Lançamento atualizado com sucesso!",
        description: `O lançamento ${transaction.title} foi atualizado com sucesso!`,
        variant: "default",
      });
      router.refresh();
    } catch (e) {
      console.log(e);
      toast({
        title: "Erro ao pagar lançamento!",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    router.push(`/?showCards=false&edit=${row.getValue("id")}`);
  };

  return (
    <div className="flex flex-row gap-12">
      <Button size={"icon"} variant={"default"} onClick={handlePayTransaction}>
        <DollarSign className="h-4 w-4" />
      </Button>
      <Button size={"icon"} variant={"ghost"} onClick={handleEdit}>
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
}
