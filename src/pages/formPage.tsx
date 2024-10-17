"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ required_error: "Обязательное поле" })
    .min(5, { message: "Минимум 5 символов" }),
  description: z
    .string({ required_error: "Обязательное поле" })
    .min(20, { message: "Минимум 20 символов" }),
  image: z.instanceof(File),
  cost: z
    .number({ required_error: "Обязательное поле" })
    .gte(500, { message: "Минимум 500 руб" }),
  time: z.number({ required_error: "Обязательное поле" }),
  table: z.array(z.object({ description: z.string(), cost: z.number() }), {
    required_error: "Обязательное поле",
  }),
  question: z.object(
    { question: z.string(), answer: z.string() },
    {
      required_error: "Обязательное поле",
    }
  ),
});

const FormPage: FC = () => {
  const [open, setOpen] = React.useState(false);

  const myForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      description: undefined,
      image: undefined,
      cost: undefined,
      time: undefined,
      table: [
        {
          description: "Рубашка-поло REDFORT, арт.210 :: Красный, M",
          cost: 300,
        },
        { description: "Нанесение рисунка методом ДТФ", cost: 500 },
        { description: "Упаковка", cost: 5000000 },
      ],
      question: {
        question:
          "Это частый вопрос, который задают заказчики. Мне надоело на него отвечать, поэтому я напишу его сюда",
        answer:
          "Lorem ipsum dolor sit amet consectetur adipiscing elit vehicula interdum penatibus, nullam risus sagittis ultricies cras metus elementum litora etiam sapien, nam donec posuere gravida orci lacinia sem est platea. Venenatis nibh potenti sed magna quis metus, congue hac porttitor justo quam ut parturient, ad arcu sociis magnis taciti. Sem scelerisqu.",
      },
    },
  });

  return (
    <main className="flex justify-center items-center w-full h-[100vh]">
      <Button variant="outline" onClick={() => setOpen(!open)}>
        Добавить
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавление услуги</DialogTitle>
            <DialogDescription>
              Добавьте свои услуги, чтобы покупатели могли купить у вас готовые
              услуги
            </DialogDescription>
          </DialogHeader>
          <Form {...myForm}>
            <form
              className="flex flex-col gap-6"
              onSubmit={myForm.handleSubmit((data) => console.log(data))}
            >
              <FormField
                control={myForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дайте название своей услуге</FormLabel>
                    <FormControl>
                      <Input placeholder="Футболки с печатью" {...field} />
                    </FormControl>
                    <FormDescription className="text-end">
                      0 из 10000 символов (минимум 5)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={myForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дайте название своей услуге</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Футболки с печатью"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="">
                      0 из 10000 символов (минимум 20)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default FormPage;
