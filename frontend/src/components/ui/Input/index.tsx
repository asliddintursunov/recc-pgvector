import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../../lib/cn.lib";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, error, id, label, leftIcon, wrapperClassName, ...props },
    ref,
  ) => {
    const inputId = id ?? props.name;
    const input = (
      <span
        className={cn(
          "flex h-11 items-center rounded-md border border-zinc-200 bg-white px-3 transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100",
          error &&
            "border-red-300 focus-within:border-red-400 focus-within:ring-red-100",
          wrapperClassName,
        )}
      >
        {leftIcon ? (
          <span className="shrink-0 text-zinc-400">{leftIcon}</span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-full w-full border-0 bg-transparent px-3 text-sm text-zinc-950 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60",
            !leftIcon && "px-0",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error && inputId ? `${inputId}-error` : undefined}
          {...props}
        />
      </span>
    );

    if (!label) {
      return input;
    }

    return (
      <label className="block">
        <span className="text-sm font-medium text-zinc-700">{label}</span>
        <span className="mt-1 block">{input}</span>
        {error && inputId ? (
          <span
            id={`${inputId}-error`}
            className="mt-1 block text-sm text-red-600"
          >
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";
