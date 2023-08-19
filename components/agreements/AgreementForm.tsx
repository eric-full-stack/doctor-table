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
import { Agreement, agreementSchema } from "./schema";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { newAgreement } from "@/lib/db";
import { toast } from "../ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function AgreementForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { userId } = useAuth();
  const form = useForm<Agreement>({
    // @ts-ignore
    resolver: zodResolver(agreementSchema),
    defaultValues: {
      multiplier: "1",
      user_id: userId!,
    },
  });
  const onSubmit: SubmitHandler<Agreement> = async (data) => {
    try {
      const agreement = await newAgreement(data);
      if (agreement) {
        toast({
          title: "Convênio cadastrado com sucesso!",
        });
        setOpen(false);
        form.reset();
        router.refresh();
      }
    } catch (e) {
      toast({
        title: "Erro ao cadastrar convênio!",
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
        <Button>Novo convênio</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Novo convênio</SheetTitle>
          <SheetDescription>
            Preencha os campos abaixo para criar um novo convênio.
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
                <Label htmlFor="multiplier" className="text-right w-[100px]">
                  Multiplicador
                </Label>
                <FormField
                  control={form.control}
                  name="multiplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          id="multiplier"
                          type="number"
                          min={1}
                          className="col-span-3"
                          {...form.register("multiplier")}
                        />
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
