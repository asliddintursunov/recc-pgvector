import { twMerge } from "tailwind-merge";

type ClassValue = string | false | null | undefined;

export const cn = (...classNames: ClassValue[]): string =>
  twMerge(classNames.filter(Boolean).join(" "));
