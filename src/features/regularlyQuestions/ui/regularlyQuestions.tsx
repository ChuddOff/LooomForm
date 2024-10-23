import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import Image from "next/image";

import { useFormContext } from "react-hook-form";

interface Question {
  id: number;
  question: string;
  answer: string;
}

export const RegularlyQuestions = ({
  setOpenQuestionAdd,
  reset,
}: {
  setOpenQuestionAdd: (arg0: boolean) => void;
  reset: () => void;
}) => {
  const { control, setValue, getValues } = useFormContext();

  return (
    <FormField
      control={control}
      name="questions"
      render={() => (
        <FormItem>
          <FormLabel>Частые вопросы</FormLabel>
          <FormDescription className="text-start mt-[12px]">
            Добавьте сюда вопросы и ответы на них, которые чаще всего задают
            заказчики
          </FormDescription>
          <FormControl>
            <div className="w-full flex flex-col gap-[12px] pt-[24px] items-start">
              {getValues("questions").map(
                (item: Question, index: number, arr: Question[]) => (
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
                            setValue("id", item.id);
                            setValue("question", item.question);
                            setValue("answer", item.answer);
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
                            setValue(
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
                                  <p className="text-[14px] text-black">4.8</p>
                                </div>
                                <p className="text-[14px] text-link">(17)</p>
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
                )
              )}
              <Button
                type="button"
                variant="link"
                className="text-link p-0 h-[22px]"
                onClick={() => {
                  reset();
                  setOpenQuestionAdd(true);
                }}
              >
                + Добавить вопрос
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
