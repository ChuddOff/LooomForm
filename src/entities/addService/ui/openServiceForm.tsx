"use client";

import { ServiceTable } from "@/features/serviceTable";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { InputFile } from "@/shared/ui/inputFile";
import { InputStartContent } from "@/shared/ui/inputStartContent";
import { Label } from "@/shared/ui/label";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Slider } from "@/shared/ui/slider";
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, RefreshCw } from "lucide-react";
import Image from "next/image";
import React, { FC, useState } from "react";
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

export const OpenServiceForm: FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [openQuestionAdd, setOpenQuestionAdd] = React.useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<boolean>(false);

  const formRef = React.useRef<HTMLFormElement>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setEditImage(true);
      setImageSrc(URL.createObjectURL(files[0]));
      myForm.setValue("image", files[0]);
    }
  };

  return (
    <>
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
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Загрузите обложку вашей услуги</FormLabel>
                      <FormControl>
                        <Card className="max-h-[264px] h-full">
                          <CardContent className="flex gap-[24px] max-h-[264px] h-full items-center">
                            <InputFile
                              id="image"
                              placeholder="Футболки с печатью"
                              {...field}
                              value=""
                              className="h-full"
                              onChange={handleFileChange}
                            />
                            {!imageSrc ? (
                              <>
                                <Label
                                  htmlFor="image"
                                  className="flex flex-col gap-[6px] text-center items-center justify-center border-gray border-dashed border-[2px] bg-card rounded-[12px] cursor-pointer px-3 py-2 !w-[500px] !h-[216px] leading-[22px] font-manrope"
                                >
                                  <ImageIcon
                                    className="text-gray"
                                    width={48}
                                    height={48}
                                  />
                                  <p className="text-[16px] text-gray font-[400]">
                                    <span className="text-link">Загрузите</span>{" "}
                                    фото или перетащите сюда
                                  </p>
                                  <p className="text-[14px] text-gray font-[400]">
                                    Размер файла слишком большой
                                  </p>
                                  {/* Отображаем текст под SVG */}
                                </Label>
                                <Label
                                  htmlFor="image"
                                  className="flex flex-col gap-[6px] h-full font-manrope cursor-pointer leading-[22px] font-[400]"
                                >
                                  <p className="text-[16px] text-black">
                                    Максимальный размер 10 мегабайт.
                                    Рекомендуемое разрешение 800px на 800px
                                  </p>
                                  <p className="text-[14px] text-gray">
                                    Рекомендация: Сделайте обложкой фото, на
                                    которой лучше всего видна работа
                                  </p>
                                </Label>
                              </>
                            ) : (
                              <>
                                <Label
                                  htmlFor="image"
                                  className="w-full flex flex-col gap-[6px] text-center items-center justify-center border-gray bg-card rounded-[12px] cursor-pointer !h-[216px] leading-[22px] font-manrope"
                                >
                                  <Image
                                    src={imageSrc}
                                    width={288}
                                    height={480}
                                    className="!w-[100%] !h-[100%] object-cover rounded-[12px]"
                                    alt="userImage"
                                  />
                                </Label>
                                <div className="flex flex-col gap-[20px] h-full w-full font-manrope leading-[22px] font-[400]">
                                  <div className="flex gap-[10px] w-full">
                                    <p className="text-[16px] text-black">
                                      Увеличить
                                    </p>
                                    <Slider
                                      defaultValue={[0]}
                                      max={100}
                                      step={1}
                                      className={"w-full"}
                                    />
                                  </div>
                                  <div className="flex gap-[10px] w-full">
                                    <p className="text-[16px] text-black">
                                      Повернуть
                                    </p>
                                    <RefreshCw
                                      width={24}
                                      height={24}
                                      className="text-orange cursor-pointer"
                                    />
                                  </div>
                                  <Label htmlFor="image">
                                    <p className="font-manrope text-link underline-offset-3 hover:underline">
                                      Выбрать другое фото
                                    </p>
                                  </Label>
                                  <div className="flex gap-[10px] w-full">
                                    <Button
                                      disabled={!editImage}
                                      type="button"
                                      className="w-full"
                                      variant="outline"
                                      onClick={() => setEditImage(false)}
                                    >
                                      Отменить
                                    </Button>
                                    <Button
                                      disabled={!editImage}
                                      className="w-full"
                                      onClick={() => setEditImage(false)}
                                    >
                                      Сохранить
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </FormControl>
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
                <ServiceTable />
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
                                      <CardDescription className="text-[14px] pt-[12px] text-gray">
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
    </>
  );
};
