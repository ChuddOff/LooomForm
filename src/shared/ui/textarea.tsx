import { cn } from "@/lib/utils";
import { forwardRef, TextareaHTMLAttributes } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex w-full rounded-[12px] border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 focus:border-input focus:outline-none text-[16px] placeholder:text-grayInput",
          className
        )}
        ref={ref}
        {...props}
        style={{ height: "140px" }}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
