import { Button } from "@/shared/ui/button";
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
import { Textarea } from "@/shared/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { z } from "zod";

interface CurrentQuestion {
  id: number | undefined;
  question: string;
  answer: string;
}
interface Question {
  id: number;
  question: string;
  answer: string;
}

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

export const RegularlyQuestionsForm = ({
  setOpenQuestionAdd,
  openQuestionAdd,
  setValue,
  questions,
  currentQuestion,
}: {
  setOpenQuestionAdd: (arg0: boolean) => void;
  openQuestionAdd: boolean;
  setValue: (value: Question[]) => void;
  questions: Question[];
  currentQuestion: CurrentQuestion;
}) => {
  const formQuestionAdd = useForm<z.infer<typeof schemaQuestionAdd>>({
    resolver: zodResolver(schemaQuestionAdd),
    defaultValues: {
      id: undefined,
      question: undefined,
      answer: undefined,
    },
  });

  useEffect(() => {
    formQuestionAdd.reset(currentQuestion);
  }, [currentQuestion]);

  return (
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
              if (currentQuestion.id !== undefined) {
                setValue(
                  questions.map((item: Question) =>
                    item.id === date.id
                      ? {
                          question: date.question,
                          answer: date.answer,
                          id:
                            Math.max(
                              ...questions.map((item: Question) => item.id)
                            ) + 1,
                        }
                      : item
                  )
                );
              } else {
                setValue(
                  questions?.concat({
                    ...date,
                    id:
                      Math.max(...questions.map((item: Question) => item.id)) +
                      1,
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
  );
};
