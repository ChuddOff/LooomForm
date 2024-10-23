import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Copy, Ellipsis, Trash2 } from "lucide-react";

import { useFormContext } from "react-hook-form";

interface Service {
  id: number;
  serviceName: string;
  cost: number;
}

export const ServiceTable = () => {
  const { control, setValue, getValues } = useFormContext();

  return (
    <Card>
      <CardContent>
        <FormField
          control={control}
          name="service"
          render={() => (
            <FormItem>
              <FormLabel>Товары и услуги</FormLabel>
              <FormDescription className="text-start">
                Заполните таблицу с описанием товаров и услуг, которые будут
                исполнены
              </FormDescription>
              <FormControl>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className=""></TableHead>
                      <TableHead className="w-[541px]">Описание</TableHead>
                      <TableHead className="text-center">Стоимость</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getValues("service").map(
                      (item: Service, index: number, arr: Service[]) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <p className="h-10 font-medium flex items-center justify-center">
                              {index + 1}
                            </p>
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={control}
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
                              control={control}
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
                                    setValue(`service`, [
                                      ...arr.slice(0, index),
                                      {
                                        ...item,
                                        id:
                                          Math.max(
                                            ...getValues("service").map(
                                              (item: Service) => item.id
                                            )
                                          ) + 1,
                                      },
                                      ...arr.slice(index),
                                    ]);
                                  }}
                                >
                                  <Copy className="!w-6 !h-6" />
                                  <p className="text-[16px]">Копировать</p>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (arr.length > 1) {
                                      setValue(`service`, [
                                        ...arr.filter((_, i) => i !== index),
                                      ]);
                                    }
                                  }}
                                >
                                  <Trash2 className="text-[#FF4040] !w-6 !h-6" />
                                  <p className="text-[16px]">Удалить</p>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    )}
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
                            setValue(`service`, [
                              ...getValues("service"),
                              {
                                id:
                                  Math.max(
                                    ...getValues("service").map(
                                      (item: Service) => item.id
                                    )
                                  ) + 1,
                                serviceName: "",
                                cost: 0,
                              },
                            ]);
                          }}
                        >
                          + Добавить товар или услугу
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
