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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { newTransaction, updateTransaction } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Procedure } from "@/components/procedures/schema";
import { Agreement } from "@/components/agreements/schema";

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

  const params = useSearchParams();
  const editTransaction = params.get("edit");

  async function getTransaction() {
    if (!editTransaction) return;
    const response = await fetch(`/api/transactions/${editTransaction}`);
    const transaction = await response.json();
    return transaction;
  }

  const form = useForm<Transaction>({
    // @ts-ignore
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      status: "pending",
      assistant: false,
      user_id: userId!,
    },
  });

  useEffect(() => {
    if (editTransaction) {
      getTransaction().then((transaction) => {
        form.setValue("id", String(transaction.id), {
          shouldValidate: true,
          shouldDirty: true,
        });
        form.setValue("title", transaction.title);
        form.setValue("procedure", String(transaction.procedure_id));
        form.setValue("agreement", String(transaction.agreement_id));
        form.setValue("amount", Number(transaction.amount));
        form.setValue("date", parseISO(transaction.date));
        form.setValue("status", transaction.status);
        form.setValue("assistant", transaction.assistant);
      });
      setOpen(true);
    }
  }, [editTransaction]);

  const onSubmit: SubmitHandler<Transaction> = async (data) => {
    try {
      const action = editTransaction ? updateTransaction : newTransaction;
      const transaction = await action(data);
      if (transaction) {
        toast({
          title: `Lançamento ${editTransaction ? "atualizado" : "cadastrado"}!`,
        });
        setOpen(false);
        form.reset();
        router.push("/?showCards=false");
        router.refresh();
      }
    } catch (e) {
      toast({
        title: `Erro ao ${
          editTransaction ? "atualizar" : "cadastrar"
        } lançamento!`,
        variant: "destructive",
      });
    }
  };

  if (editTransaction && !form.getValues("id")) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
        router.push("/?showCards=false");
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
                  name="procedure"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "min-w-[218px] max-w-[220px] w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? procedures.find(
                                      (procedure) =>
                                        Number(procedure.id) ===
                                        Number(field.value)
                                    )?.title
                                  : "Selecione..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="min-w-[218px] max-w-[220px] w-full p-0">
                            <Command>
                              <CommandInput placeholder="Procurar procedimento..." />
                              <CommandEmpty>
                                Procedimento não encontrado
                              </CommandEmpty>
                              <CommandGroup>
                                {procedures.map((procedure) => (
                                  <CommandItem
                                    value={procedure.title}
                                    key={procedure.title}
                                    onSelect={(value) => {
                                      const selectedProcedure = procedures.find(
                                        (procedure) =>
                                          procedure.title
                                            .toLocaleLowerCase()
                                            .trim() === value
                                      );
                                      if (!selectedProcedure) return;
                                      form.setValue(
                                        "procedure",
                                        String(procedure.id)
                                      );
                                      form.setValue(
                                        "amount",
                                        (procedures.find(
                                          (procedure) =>
                                            Number(procedure.id) ===
                                            Number(selectedProcedure.id)
                                        )?.amount || 0) * 1
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        Number(procedure.id) ===
                                          Number(field.value)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {procedure.title}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="agreement" className="text-right w-[100px]">
                  Convênio
                </Label>
                <FormField
                  control={form.control}
                  name="agreement"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "min-w-[218px] max-w-[220px] w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? agreements.find(
                                      (agreement) =>
                                        Number(agreement.id) ===
                                        Number(field.value)
                                    )?.title
                                  : "Selecione..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="min-w-[218px] max-w-[220px] w-full p-0">
                            <Command>
                              <CommandInput placeholder="Procurar convênio..." />
                              <CommandEmpty>
                                Convênio não encontrado
                              </CommandEmpty>
                              <CommandGroup>
                                {agreements.map((agreement) => (
                                  <CommandItem
                                    value={agreement.title}
                                    key={Math.random()}
                                    onSelect={(value) => {
                                      const selectedAgreement = agreements.find(
                                        (agreement) =>
                                          agreement.title
                                            .toLocaleLowerCase()
                                            .trim() === value
                                      );

                                      if (!selectedAgreement) return;
                                      const amount =
                                        procedures.find(
                                          (procedures) =>
                                            Number(procedures.id) ===
                                            Number(form.getValues("procedure"))
                                        )?.amount || 0;

                                      form.setValue(
                                        "amount",
                                        (Number(selectedAgreement.multiplier) ||
                                          1) *
                                          amount *
                                          1
                                      );
                                      form.setValue(
                                        "agreement",
                                        String(selectedAgreement.id)
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        Number(agreement.id) ===
                                          Number(field.value)
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {agreement.title}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
                  defaultChecked={form.getValues("status") === "paid"}
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
                  defaultChecked={form.getValues("assistant")}
                  onCheckedChange={(checked) => {
                    form.setValue("assistant", !!checked);
                  }}
                />
              </div>
            </div>
            <SheetFooter className="mt-5">
              <Button type="submit">
                {editTransaction ? "Atualizar" : "Cadastrar"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
