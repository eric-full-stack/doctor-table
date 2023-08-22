import { Transaction } from "./schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  isSameMonth,
  isSameWeek,
  isToday,
  isYesterday,
} from "date-fns";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

export default function SummaryCards({ data }: { data: Transaction[] }) {
  type TimePeriod =
    | "today"
    | "yesterday"
    | "week"
    | "lastWeek"
    | "month"
    | "lastMonth";

  const totals: Record<TimePeriod, (date: Date) => boolean> = {
    today: isToday,
    yesterday: isYesterday,
    week: (date) => isSameWeek(date, new Date()),
    lastWeek: (date) => differenceInCalendarWeeks(new Date(), date) == 1,
    month: (date) => isSameMonth(date, new Date()),
    lastMonth: (date) => differenceInCalendarMonths(new Date(), date) == 1,
  };

  type ResultType = {
    [key in TimePeriod]: { paid: number; pending: number; total: number };
  };

  const results: ResultType = {
    today: { paid: 0, pending: 0, total: 0 },
    yesterday: { paid: 0, pending: 0, total: 0 },
    week: { paid: 0, pending: 0, total: 0 },
    lastWeek: { paid: 0, pending: 0, total: 0 },
    month: { paid: 0, pending: 0, total: 0 },
    lastMonth: { paid: 0, pending: 0, total: 0 },
  };

  for (let key in totals) {
    data.forEach((curr) => {
      const currDate = new Date(curr.date);
      if (totals[key as TimePeriod](currDate)) {
        results[key as TimePeriod][curr.status as "pending" | "paid"] += Number(
          curr.amount
        );
        results[key as TimePeriod].total += Number(curr.amount);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Total hoje</CardTitle>
          <CardDescription>R$</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {results.today.total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {results.yesterday.total / (results.today.total || 1) > 1 ? (
              <span className="text-red-500 text-sm flex">
                {(results.yesterday.total / (results.today.total || 1)).toFixed(
                  2
                )}
                % <ArrowDownIcon /> ontem
              </span>
            ) : (
              <span className="text-green-500 text-sm flex items-center">
                {(results.today.total / (results.yesterday.total || 1)).toFixed(
                  2
                )}
                % <ArrowUpIcon />
                ontem
              </span>
            )}
          </p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total semana</CardTitle>
          <CardDescription>R$</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {results.week.total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {results.lastWeek.total / (results.week.total || 1) > 1 ? (
              <span className="text-red-500 text-sm flex">
                {(results.lastWeek.total / (results.week.total || 1)).toFixed(
                  2
                )}
                % <ArrowDownIcon /> semana passada
              </span>
            ) : (
              <span className="text-green-500 text-sm flex items-center">
                {(results.week.total / (results.lastWeek.total || 1)).toFixed(
                  2
                )}
                % <ArrowUpIcon />
                semana passada
              </span>
            )}
          </p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total mês</CardTitle>
          <CardDescription>R$</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {results.month.total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {results.lastMonth.total / (results.month.total || 1) > 1 ? (
              <span className="text-red-500 text-sm flex">
                {(results.lastMonth.total / (results.month.total || 1)).toFixed(
                  2
                )}
                % <ArrowDownIcon /> mês passado
              </span>
            ) : (
              <span className="text-green-500 text-sm flex items-center">
                {(results.month.total / (results.lastMonth.total || 1)).toFixed(
                  2
                )}
                % <ArrowUpIcon /> mês passado
              </span>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
