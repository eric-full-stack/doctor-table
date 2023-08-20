"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Transaction, transactionSchema } from "./schema";
import { useForm, SubmitHandler } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import IntlCurrencyInput from "@h3aven-labs/react-intl-currency-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { newTransaction } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Procedure } from "@/components/procedures/schema";
import { Agreement } from "@/components/agreements/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencyConfig = {
  locale: "pt-BR",
  formats: {
    number: {
      BRL: {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

type Props = {
  procedures: Procedure[];
  agreements: Agreement[];
};

export function TransactionForm({ procedures, agreements }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { userId } = useAuth();
  const form = useForm<Transaction>({
    // @ts-ignore
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      status: "pending",
      assistant: false,
      user_id: userId!,
    },
  });
  const onSubmit: SubmitHandler<Transaction> = async (data) => {
    try {
      const transaction = await newTransaction(data);
      if (transaction) {
        toast({
          title: "Lançamento cadastrado com sucesso!",
        });
        setOpen(false);
        form.reset();
        router.refresh();
      }
    } catch (e) {
      toast({
        title: "Erro ao cadastrar lançamento!",
        variant: "destructive",
      });
    }
  };
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <SheetTrigger asChild>
        <Button>Novo lançamento</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Novo lançamento</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo para criar um novo lançamento.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-xl mx-auto"
          >
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="title" className="text-right w-[100px]">
                  Título
                </Label>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="title"
                          className="col-span-3"
                          {...form.register("title")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="procedure" className="text-right w-[100px]">
                  Procedimento
                </Label>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          {...form.register("procedure")}
                          onValueChange={(value) => {
                            form.setValue("procedure", value);
                            console.log(value);
                            form.setValue(
                              "amount",
                              (procedures.find(
                                (procedure) =>
                                  Number(procedure.id) === Number(value)
                              )?.amount || 0) * 1
                            );
                          }}
                        >
                          <SelectTrigger className="min-w-[218px] max-w-[220px] w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {procedures.map((procedure) => (
                              <SelectItem
                                key={procedure.id}
                                value={String(procedure.id)}
                              >
                                {procedure.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="agreement" className="text-right w-[100px]">
                  Convênio
                </Label>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          {...form.register("agreement")}
                          onValueChange={(value) => {
                            form.setValue("agreement", value);
                            const amount =
                              procedures.find(
                                (procedure) =>
                                  Number(procedure.id) ===
                                  Number(form.getValues("procedure"))
                              )?.amount || 0;

                            form.setValue(
                              "amount",
                              (Number(
                                agreements.find(
                                  (agreement) =>
                                    Number(agreement.id) === Number(value)
                                )?.multiplier
                              ) || 1) *
                                amount *
                                1
                            );
                          }}
                        >
                          <SelectTrigger className="min-w-[218px] max-w-[220px] w-full">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {agreements.map((agreement) => (
                              <SelectItem
                                key={agreement.id}
                                value={String(agreement.id)}
                              >
                                {agreement.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="title" className="text-right w-[100px]">
                  Multiplicador
                </Label>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="title"
                          type="number"
                          step={0.1}
                          defaultValue={1}
                          className="col-span-3"
                          onChange={(event) => {
                            const multiplier = Number(event.target.value);
                            if (!multiplier) return;
                            let amount =
                              procedures.find(
                                (procedure) =>
                                  Number(procedure.id) ===
                                  Number(form.getValues("procedure"))
                              )?.amount || 0;
                            amount =
                              (Number(
                                agreements.find(
                                  (agreement) =>
                                    Number(agreement.id) ===
                                    Number(form.getValues("agreement"))
                                )?.multiplier
                              ) || 1) *
                              amount *
                              1;
                            form.setValue("amount", multiplier * amount);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="amount" className="text-right w-[100px]">
                  Valor
                </Label>
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <IntlCurrencyInput
                          {...field}
                          component={Input}
                          currency="BRL"
                          defaultValue={field.value}
                          max={99999}
                          config={{
                            ...currencyConfig,
                            locale: "pt-BR",
                          }}
                          onChange={(event, value, maskedValue) => {
                            if (value) {
                              field.onChange(value);
                            }
                          }}
                        ></IntlCurrencyInput>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex  items-center gap-4">
                <Label htmlFor="date" className="text-right w-[100px]">
                  Data
                </Label>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "min-w-[218px] max-w-[220px] w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="status" className="text-right w-[100px]">
                  Recebido?
                </Label>
                <Checkbox
                  id="status"
                  className="col-span-3"
                  {...form.register("status")}
                  onCheckedChange={(checked) => {
                    form.setValue("status", checked ? "paid" : "pending");
                  }}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="assistant" className="text-right w-[100px]">
                  Assistente?
                </Label>
                <Checkbox
                  id="assistant"
                  className="col-span-3"
                  {...form.register("assistant")}
                  onCheckedChange={(checked) => {
                    form.setValue("assistant", !!checked);
                  }}
                />
              </div>
            </div>
            <SheetFooter className="mt-5">
              <Button type="submit">Cadastrar</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
