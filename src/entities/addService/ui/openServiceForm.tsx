"use client";

import {
  RegularlyQuestions,
  RegularlyQuestionsForm,
} from "@/features/regularlyQuestions";
import { ServiceTable } from "@/features/serviceTable";
import { UploadImage } from "@/features/uploadImage";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
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
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CurrentQuestion {
  id: number | undefined;
  question: string;
  answer: string;
}

const formSchema = z.object({
  name: z
    .string({ required_error: "Обязательное поле" })
    .min(5, { message: "Минимум 5 символов" })
    .max(10000, { message: "Максимум 10000 символов" }),
  description: z
    .string({ required_error: "Обязательное поле" })
    .min(20, { message: "Минимум 20 символов" })
    .max(10000, { message: "Максимум 10000 символов" }),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: "Размер файла не должен превышать 10 МБ.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
      message: "Загрузите изобра��ение формата JPG или PNG!",
    }),
  cost: z
    .number({ required_error: "Обязательное поле" })
    .gte(500, { message: "Минимум 500 руб" }),
  time: z.number({ required_error: "Обязательное поле" }),
  service: z
    .array(
      z.object({
        id: z.number({ required_error: "Обязательное поле" }),
        serviceName: z
          .string({
            required_error: "Обязательное поле",
          })
          .min(4, { message: "Минимум 4 символа" }),
        cost: z
          .number({
            invalid_type_error: "Введите нормальное число",
          })
          .min(0, { message: "Введите нормальное число" }),
      })
    )
    .min(1, { message: "Необходимо добавить хотя бы одно поле" }),
  questions: z
    .array(
      z.object({
        id: z.number(),
        question: z.string({ required_error: "Обязательное поле" }),
        answer: z.string({ required_error: "Обязательное поле" }),
      })
    )
    .min(1, { message: "Необходимо добавить хотя бы одно поле" }),
});

export const OpenServiceForm: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openQuestionAdd, setOpenQuestionAdd] = useState<boolean>(false);

  const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestion>({
    id: undefined,
    question: "",
    answer: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  const myForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      description: undefined,
      image: undefined,
      cost: undefined,
      time: undefined,
      service: [
        {
          id: 0,
          serviceName: "Рубашка-поло REDFORT, арт.210 :: Красный, M",
          cost: 300,
        },
        { id: 1, serviceName: "Нанесение рисунка методом ДТФ", cost: 500 },
        { id: 2, serviceName: "Упаковка", cost: 5000000 },
      ],
      questions: [
        {
          id: 0,
          question:
            "Это частый вопрос, который задают заказчики. Мне надоело на него отвечать, поэтому я напишу его сюда",
          answer:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit vehicula interdum penatibus, nullam risus sagittis ultricies cras metus elementum litora etiam sapien, nam donec posuere gravida orci lacinia sem est platea. Venenatis nibh potenti sed magna quis metus, congue hac porttitor justo quam ut parturient, ad arcu sociis magnis taciti. Sem scelerisqu.",
        },
      ],
    },
  });

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(!open)}>
        Добавить
      </Button>

      <Dialog open={open} onOpenChange={setOpen} aria-hidden="true">
        <DialogOverlay />
        <DialogContent className={`${openQuestionAdd && "hidden"}`}>
          <DialogHeader>
            <DialogTitle>Добавление услуги</DialogTitle>
            <DialogDescription>
              Добавьте свои услуги, чтобы покупатели могли купить у вас готовые
              услуги
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[950px] w-full rounded-md pr-[12px]">
            <Form {...myForm}>
              <form
                ref={formRef}
                className="flex flex-col gap-6"
                onSubmit={myForm.handleSubmit(() => {
                  const formData = new FormData(
                    formRef.current as HTMLFormElement
                  );
                  formData.forEach((value, key) => {
                    console.log(`${key}:`, value);
                  });
                  setOpen(false);
                })}
              >
                <FormField
                  control={myForm.control}
                  name={`name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дайте название своей услуге</FormLabel>
                      <FormControl>
                        <Input placeholder="Футболки с печатью" {...field} />
                      </FormControl>
                      <FormDescription className="text-end">
                        {`${
                          myForm.watch("name")?.length || 0
                        } из 10000 символов (минимум 5)`}
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
                        {`${
                          myForm.watch("description")?.length || 0
                        } из 10000 символов (минимум 20)`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <UploadImage />
                <FormField
                  control={myForm.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Укажите стоимость услуги</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Минимум 500 руб"
                          content="Руб."
                          {...field}
                          onChange={(e) => {
                            field.onChange(
                              isNaN(+e.target.value)
                                ? e.target.value
                                : +e.target.value
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={myForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Срок исполнения услуги</FormLabel>
                      <FormControl className="flex">
                        <Input
                          placeholder="500"
                          content="Дней"
                          {...field}
                          onChange={(e) => {
                            field.onChange(
                              isNaN(+e.target.value)
                                ? e.target.value
                                : +e.target.value
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ServiceTable />
                <RegularlyQuestions
                  setOpenQuestionAdd={setOpenQuestionAdd}
                  setCurrentQuestion={setCurrentQuestion}
                />

                <div className="flex gap-[24px] w-full">
                  <Button type="button" className="w-full" variant="outline">
                    Отменить
                  </Button>
                  <Button type="submit" className="w-full">
                    Сохранить
                  </Button>
                </div>
              </form>
            </Form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <RegularlyQuestionsForm
        setOpenQuestionAdd={setOpenQuestionAdd}
        openQuestionAdd={openQuestionAdd}
        questions={myForm.watch("questions")}
        setValue={(value) => myForm.setValue("questions", value)}
        currentQuestion={currentQuestion}
      />
    </>
  );
};
