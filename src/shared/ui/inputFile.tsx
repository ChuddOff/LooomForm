import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const InputFile = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="file"
        className={cn(
          "hidden w-full border-[2px] border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 rounded-[12px] focus:border-input focus:outline-none text-[16px] text-grayInput",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
InputFile.displayName = "Input";

export { InputFile };
