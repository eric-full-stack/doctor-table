"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Procedure } from "./schema";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns: ColumnDef<Procedure>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Título" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("title")}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>
            {Number(row.getValue("amount")).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        </div>
      );
    },
  },
];
