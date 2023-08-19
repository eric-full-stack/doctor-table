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
import { Procedure, procedureSchema } from "./schema";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import IntlCurrencyInput from "@h3aven-labs/react-intl-currency-input";
import { newProcedure } from "@/lib/db";
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

export function ProcedureForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { userId } = useAuth();
  const form = useForm<Procedure>({
    // @ts-ignore
    resolver: zodResolver(procedureSchema),
    defaultValues: {
      user_id: userId!,
    },
  });
  const onSubmit: SubmitHandler<Procedure> = async (data) => {
    try {
      const procedure = await newProcedure(data);
      if (procedure) {
        toast({
          title: "Procedimento cadastrado com sucesso!",
        });
        setOpen(false);
        form.reset();
        router.refresh();
      }
    } catch (e) {
      toast({
        title: "Erro ao cadastrar Procedimento!",
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
        <Button>Novo Procedimento</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Novo Procedimento</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo para criar um novo Procedimento.
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
                  Nome
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
                          max={999999}
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
