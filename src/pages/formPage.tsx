"use client";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
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
import { InputStartContent } from "@/shared/ui/inputStartContent";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Ellipsis, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ required_error: "Обязательное поле" })
    .min(5, { message: "Минимум 5 символов" })
    .max(10000, { message: "Максимум 10000 символов" }),
  description: z
    .string({ required_error: "Обязательное поле" })
    .min(20, { message: "Минимум 20 символов" })
    .max(10000, { message: "Максимум 10000 символов" }),
  image: z.any().refine((file) => file instanceof File, {
    message: "Необходимо загрузить файл",
  }),
  cost: z
    .number({ required_error: "Обязательное поле" })
    .gte(500, { message: "Минимум 500 руб" }),
  time: z.number({ required_error: "Обязательное поле" }),
  service: z
    .array(
      z.object({
        id: z.number({ required_error: "Обязательное поле" }),
        serviceName: z.string({
          required_error: "Обязательное поле",
        }),
        cost: z.number({
          invalid_type_error: "Введите нормальное число",
        }),
      })
    )
    .min(1, { message: "Необходимо добавить хотя бы одно поле" })
    .refine(
      (services) =>
        services.some(
          (service) => service.serviceName?.trim() !== "" || service.cost > 0
        ),
      {
        message: "Необходимо добавить хотя бы одно поле",
      }
    ),
  questions: z.array(
    z.object({
      id: z.number().optional(),
      question: z
        .string({ required_error: "Обязательное поле" })
        .min(4, {
          message: "Минимум 4 символа",
        })
        .max(40, { message: "Максимум 40 символов" }),
      answer: z
        .string({ required_error: "Обязательное поле" })
        .min(4, {
          message: "Минимум 4 символа",
        })
        .max(10000, { message: "Максимум 10000 символов" }),
    })
  ),
});

const schemaQuestionAdd = z.object({
  id: z.number().optional(),
  question: z
    .string({ required_error: "Обязательное поле" })
    .min(4, { message: "Минимум 4 символа" })
    .max(40, { message: "Максимум 40 символов" }),
  answer: z
    .string({ required_error: "Обязательное поле" })
    .min(4, { message: "Минимум 4 символа" })
    .max(10000, { message: "Максимум 10000 символов" }),
});

const FormPage: FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [openQuestionAdd, setOpenQuestionAdd] = React.useState<boolean>(false);

  const formQuestionAdd = useForm<z.infer<typeof schemaQuestionAdd>>({
    resolver: zodResolver(schemaQuestionAdd),
    defaultValues: {
      id: undefined,
      question: undefined,
      answer: undefined,
    },
  });

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
    <main className="flex justify-center items-center w-full h-[100vh]">
      <Button variant="outline" onClick={() => setOpen(!open)}>
        Добавить
      </Button>

      <Dialog
        open={open && !openQuestionAdd}
        onOpenChange={setOpen}
        aria-hidden="true"
      >
        <DialogContent>
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
                className="flex flex-col gap-6"
                onSubmit={myForm.handleSubmit((data) => console.log(data))}
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
                          myForm.getValues("name")?.length || 0
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
                          myForm.getValues("description")?.length || 0
                        } из 10000 символов (минимум 20)`}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={myForm.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Укажите стоимость услуги</FormLabel>
                      <FormControl>
                        <InputStartContent
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
                        <InputStartContent
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
                <Card>
                  <CardContent>
                    <FormField
                      control={myForm.control}
                      name="service"
                      render={() => (
                        <FormItem>
                          <FormLabel>Товары и услуги</FormLabel>
                          <FormDescription className="text-start">
                            Заполните таблицу с описанием товаров и услуг,
                            которые будут исполнены
                          </FormDescription>
                          <FormControl>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className=""></TableHead>
                                  <TableHead className="w-[541px]">
                                    Описание
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Стоимость
                                  </TableHead>
                                  <TableHead></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {myForm
                                  .getValues("service")
                                  .map((item, index, arr) => (
                                    <TableRow key={item.id}>
                                      <TableCell>
                                        <p className="h-10 font-medium flex items-center justify-center">
                                          {index + 1}
                                        </p>
                                      </TableCell>
                                      <TableCell>
                                        <FormField
                                          control={myForm.control}
                                          name={`service.${index}.serviceName`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormControl>
                                                <Input
                                                  placeholder="Введите текст"
                                                  {...field}
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <FormField
                                          control={myForm.control}
                                          name={`service.${index}.cost`}
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormControl>
                                                <Input
                                                  placeholder="Введите число"
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
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <DropdownMenu>
                                          <DropdownMenuTrigger className="h-10">
                                            <Ellipsis width={24} height={24} />
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent>
                                            <DropdownMenuItem
                                              onClick={() => {
                                                myForm.setValue(`service`, [
                                                  ...arr.slice(0, index),
                                                  {
                                                    ...item,
                                                    id:
                                                      Math.max(
                                                        ...myForm
                                                          .getValues("service")
                                                          .map(
                                                            (item) => item.id
                                                          )
                                                      ) + 1,
                                                  },
                                                  ...arr.slice(index),
                                                ]);
                                              }}
                                            >
                                              <Copy className="!w-6 !h-6" />
                                              <p className="text-[16px]">
                                                Копировать
                                              </p>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => {
                                                myForm.setValue(`service`, [
                                                  ...arr.filter(
                                                    (_, i) => i !== index
                                                  ),
                                                ]);
                                              }}
                                            >
                                              <Trash2 className="text-[#FF4040] !w-6 !h-6" />
                                              <p className="text-[16px]">
                                                Удалить
                                              </p>
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TableCell></TableCell>
                                  <TableCell className="text-left p-[12px]">
                                    <Button
                                      type="button"
                                      variant="link"
                                      className="text-link p-0"
                                      onClick={() => {
                                        myForm.setValue(`service`, [
                                          ...myForm.getValues("service"),
                                          {
                                            id:
                                              Math.max(
                                                ...myForm
                                                  .getValues("service")
                                                  .map((item) => item.id)
                                              ) + 1,
                                            serviceName: "",
                                            cost: 0,
                                          },
                                        ]);
                                        myForm.setFocus(
                                          `service.${Math.max(
                                            ...myForm
                                              .getValues("service")
                                              .map((item) => item.id)
                                          )}.serviceName`
                                        );
                                      }}
                                    >
                                      + Добавить товар или услугу
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                            </Table>
                          </FormControl>
                          <FormMessage>
                            {myForm.formState.errors.service?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                <FormField
                  control={myForm.control}
                  name="questions"
                  render={() => (
                    <FormItem>
                      <FormLabel>Частые вопросы</FormLabel>
                      <FormDescription className="text-start mt-[12px]">
                        Добавьте сюда вопросы и ответы на них, которые чаще
                        всего задают заказчики
                      </FormDescription>
                      <FormControl>
                        <div className="w-full flex flex-col gap-[12px] pt-[24px] items-start">
                          {myForm
                            .getValues("questions")
                            .map((item, index, arr) => (
                              <Card key={item.id}>
                                <CardHeader className="flex flex-row gap-[12px] w-full items-center">
                                  <p className="text-[16px] text-black w-full h-min">
                                    {item.question}
                                  </p>
                                  <div className="flex gap-[12px]">
                                    <Button
                                      type="button"
                                      variant="link"
                                      className="text-link p-0"
                                      onClick={() => {
                                        formQuestionAdd.setValue("id", item.id);
                                        formQuestionAdd.setValue(
                                          "question",
                                          item.question
                                        );
                                        formQuestionAdd.setValue(
                                          "answer",
                                          item.answer
                                        );
                                        setOpenQuestionAdd(true);
                                      }}
                                    >
                                      Редактировать
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="link"
                                      className="text-link p-0 text-[#FF4040]"
                                      onClick={() => {
                                        myForm.setValue(
                                          `questions`,
                                          arr.filter((_, i) => i !== index)
                                        );
                                      }}
                                    >
                                      Удалить
                                    </Button>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <Card className="bg-white mt-[24px]">
                                    <CardHeader>
                                      <CardTitle className="flex gap-[12px] font-manrope">
                                        <Image
                                          src={"/Avatar.jpg"}
                                          alt="avatar"
                                          width={48}
                                          height={48}
                                          className="rounded-full"
                                        />
                                        <section className="flex flex-col gap-[6px] justify-between">
                                          <p className="text-[16px] text-black">
                                            Принтули от дедули
                                          </p>
                                          <div className="flex gap-[6px]">
                                            <div className="flex gap-[2px]">
                                              <Image
                                                src={"/star.svg"}
                                                alt="star"
                                                width={16}
                                                height={16}
                                              />
                                              <p className="text-[14px] text-black">
                                                4.8
                                              </p>
                                            </div>
                                            <p className="text-[14px] text-link">
                                              (17)
                                            </p>
                                          </div>
                                        </section>
                                      </CardTitle>
                                      <CardDescription className="text-[14px] pt-[12px]">
                                        Ответ исполнителя:
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-[16px]">
                                      {item.answer}
                                    </CardContent>
                                  </Card>
                                </CardContent>
                              </Card>
                            ))}
                          <Button
                            type="button"
                            variant="link"
                            className="text-link p-0 h-[22px]"
                            onClick={() => {
                              formQuestionAdd.reset();
                              setOpenQuestionAdd(true);
                            }}
                          >
                            + Добавить вопрос
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage>
                        {myForm.formState.errors.service?.message}
                      </FormMessage>
                    </FormItem>
                  )}
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
      <Dialog open={openQuestionAdd} onOpenChange={setOpenQuestionAdd}>
        <DialogContent className="max-w-[796px]">
          <DialogHeader>
            <DialogTitle>Добавление частого вопроса</DialogTitle>
            <DialogDescription>
              Добавьте ответы на частые вопросы, чтобы клиенты сразу могли
              понимать вашу услугу
            </DialogDescription>
          </DialogHeader>
          <Form {...formQuestionAdd}>
            <form
              className="flex flex-col gap-6"
              onSubmit={formQuestionAdd.handleSubmit((date) => {
                console.log(date.id);

                if (date.id !== undefined) {
                  myForm.setValue(
                    `questions`,
                    myForm.getValues("questions").map((item) =>
                      item.id === date.id
                        ? {
                            question: date.question,
                            answer: date.answer,
                            id:
                              Math.max(
                                ...myForm
                                  .getValues("questions")
                                  .map((item) => item.id)
                              ) + 1,
                          }
                        : item
                    )
                  );
                } else {
                  myForm.setValue(
                    `questions`,
                    myForm.getValues("questions")?.concat({
                      ...date,
                      id:
                        Math.max(
                          ...myForm
                            .getValues("questions")
                            .map((item) => item.id)
                        ) + 1,
                    })
                  );
                }

                setOpenQuestionAdd(false);
              })}
            >
              <FormField
                control={formQuestionAdd.control}
                name={"question"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Вопрос</FormLabel>
                    <FormControl>
                      <Input placeholder="Вопрос" {...field} />
                    </FormControl>
                    <FormDescription className="text-end">
                      {`${
                        formQuestionAdd.watch("question")?.length || 0
                      } из 40 символов (минимум 4)`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formQuestionAdd.control}
                name={"answer"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваш ответ</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ответ"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="">
                      {`${
                        formQuestionAdd.watch("answer")?.length || 0
                      } из 10000 символов (минимум 4)`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-[24px] w-full">
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  onClick={() => setOpenQuestionAdd(false)}
                >
                  Отменить
                </Button>
                <Button type="submit" className="w-full">
                  Сохранить
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default FormPage;
