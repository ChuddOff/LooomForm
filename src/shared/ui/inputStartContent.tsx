import * as React from "react";

import { cn } from "@/lib/utils";
import { InputProps } from "./input";

const InputStartContent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, content, ...props }, ref) => {
    return (
      <div className="flex w-full border-[2px] border-input bg-background rounded-[12px] h-10">
        <span className="px-2 rounded-l-[12px] border-r-[2px] border-input flex items-center justify-center text-[16px]">
          {content}
        </span>
        <input
          type={type}
          style={{
            content: `"${content}"`,
          }}
          className={cn(
            `rounded-r-[12px] w-full px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:cursor-not-allowed disabled:opacity-50 focus:border-input focus:outline-none text-[16px] placeholder:text-grayInput`,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
InputStartContent.displayName = "InputStartContent";

export { InputStartContent };
