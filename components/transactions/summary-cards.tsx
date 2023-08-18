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
  const totalToday = data.reduce((acc, curr) => {
    if (curr.status === "paid" && isToday(new Date(curr.date))) {
      return acc + Number(curr.amount);
    }
    return acc;
  }, 0);
  const totalYesterday = data.reduce((acc, curr) => {
    const currDate = new Date(curr.date);
    if (curr.status === "paid" && isYesterday(currDate)) {
      return acc + Number(curr.amount);
    }
    return acc;
  }, 0);

  const totalWeek = data.reduce((acc, curr) => {
    const currDate = new Date(curr.date);
    const isWeek = isSameWeek(currDate, new Date());
    if (isWeek && curr.status === "paid") {
      return acc + Number(curr.amount);
    }
    return acc;
  }, 0);

  const totalLastWeek = data.reduce((acc, curr) => {
    const currDate = new Date(curr.date);
    const isLastWeek = differenceInCalendarWeeks(new Date(), currDate) == 1;
    if (isLastWeek && curr.status === "paid") {
      return acc + Number(curr.amount);
    }
    return acc;
  }, 0);

  const totalMonth = data.reduce((acc, curr) => {
    const currDate = new Date(curr.date);
    if (isSameMonth(currDate, new Date()) && curr.status === "paid") {
      return acc + Number(curr.amount);
    }
    return acc;
  }, 0);

  const totalLastMonth = data.reduce((acc, curr) => {
    const currDate = new Date(curr.date);
    const isLastMonth = differenceInCalendarMonths(new Date(), currDate) == 1;
    if (isLastMonth && curr.status === "paid") {
      return acc + Number(curr.amount);
    }
    return acc;
  }, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Total hoje</CardTitle>
          <CardDescription>R$</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {totalToday.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {totalYesterday / (totalToday || 1) > 1 ? (
              <span className="text-red-500 text-sm flex">
                {totalYesterday / (totalToday || 1)}% <ArrowDownIcon /> ontem
              </span>
            ) : (
              <span className="text-green-500 text-sm flex items-center">
                {totalToday / (totalYesterday || 1)}% <ArrowUpIcon />
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
            {totalWeek.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {totalLastWeek / (totalWeek || 1) > 1 ? (
              <span className="text-red-500 text-sm flex">
                {totalLastWeek / (totalWeek || 1)}% <ArrowDownIcon /> semana
                passada
              </span>
            ) : (
              <span className="text-green-500 text-sm flex items-center">
                {totalWeek / (totalLastWeek || 1)}% <ArrowUpIcon />
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
            {totalMonth.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {totalLastMonth / (totalMonth || 1) > 1 ? (
              <span className="text-red-500 text-sm flex">
                {totalLastMonth / (totalMonth || 1)}% <ArrowDownIcon /> mês
                passado
              </span>
            ) : (
              <span className="text-green-500 text-sm flex items-center">
                {(totalMonth / (totalLastMonth || 1)).toFixed(2)}%{" "}
                <ArrowUpIcon /> mês passado
              </span>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
