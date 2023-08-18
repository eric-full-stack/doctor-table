"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/transactions/data-table-view-options";

import { labels, statuses } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { ptBR } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col sm:flex-row flex-1 ">
        <div className="flex flex-1 items-center space-x-2 w-full">
          <Input
            placeholder="Filtrar por título..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={statuses}
            />
          )}
          {table.getColumn("date") && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "max-w-[240px] min-w-[120px] pl-3 text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  {selectedDate ? (
                    format(selectedDate, "dd/MM", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Filtrar data</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (!date) return;
                    setSelectedDate(date);
                    table
                      .getColumn("date")
                      ?.setFilterValue(format(date, "yyyy-MM-dd"));
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              setSelectedDate(undefined);
            }}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
