"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Agreement } from "./schema";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns: ColumnDef<Agreement>[] = [
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
    accessorKey: "multiplier",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Multiplicador" />
    ),
    cell: ({ row }) => {
      return <span>{row.getValue("multiplier")}</span>;
    },
  },
];
