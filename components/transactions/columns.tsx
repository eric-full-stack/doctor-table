"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { statuses } from "./data";
import { Transaction } from "./schema";
import { DataTableColumnHeader } from "@/components/transactions/data-table-column-header";
import { DataTableRowActions } from "@/components/transactions/data-table-row-actions";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { format, parseISO } from "date-fns";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recebido?" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <Badge
          variant={"outline"}
          className={`px-2 py-1 ${
            row.getValue("status") === "paid" ? "bg-[#84cc16]" : "bg-[#eab308]"
          }`}
        >
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("id")}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      return (
        <span className="max-w-[500px] truncate font-medium">
          {format(parseISO(row.getValue("date")), "dd/MM/yyyy")}
        </span>
      );
    },
  },
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
    accessorKey: "procedure",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Procedimento" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue("procedure")}</span>;
    },
  },
  {
    accessorKey: "agreement",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Convênio" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue("agreement")}</span>;
    },
  },
  {
    accessorKey: "assistant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assistente" />
    ),
    cell: ({ row }) => {
      const assistant = row.getValue("assistant") as boolean;
      if (!assistant) {
        return null;
      }

      return (
        <div className="flex items-center">
          {assistant && (
            <CheckCircledIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
        </div>
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
