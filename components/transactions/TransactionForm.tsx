"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
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
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { ptBR } from "date-fns/locale";
import { newTransaction } from "@/lib/db";
import { toast } from "../ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export function TransactionForm() {
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
                        <Input
                          id="procedure"
                          className="col-span-3"
                          {...form.register("procedure")}
                        />
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
                        <Input
                          id="agreement"
                          className="col-span-3"
                          {...form.register("agreement")}
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
              <div className="flex items-center gap-4">
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
                                "w-[240px] pl-3 text-left font-normal",
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
