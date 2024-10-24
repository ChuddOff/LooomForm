import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { InputFile } from "@/shared/ui/inputFile";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Image as ImageIcon, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useFormContext } from "react-hook-form";

export const UploadImage = () => {
  const { control, setValue } = useFormContext();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setEditImage(true);
      setImageSrc(URL.createObjectURL(files[0]));
      setValue("image", files[0]);
    }
  };

  return (
    <FormField
      control={control}
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
                      <ImageIcon className="text-gray" width={48} height={48} />
                      <p className="text-[16px] text-gray font-[400]">
                        <span className="text-link">Загрузите</span> фото или
                        перетащите сюда
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
                        Максимальный размер 10 мегабайт. Рекомендуемое
                        разрешение 800px на 800px
                      </p>
                      <p className="text-[14px] text-gray">
                        Рекомендация: Сделайте обложкой фото, на которой лучше
                        всего видна работа
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
                        <p className="text-[16px] text-black">Увеличить</p>
                        <Slider
                          defaultValue={[0]}
                          max={100}
                          step={1}
                          className={"w-full"}
                        />
                      </div>
                      <div className="flex gap-[10px] w-full">
                        <p className="text-[16px] text-black">Повернуть</p>
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
  );
};
