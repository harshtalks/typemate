import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DATE_FORMAT = "MM.dd.yyyy hh:mm a";

export const arrUniqueBy =
  <T>(keyExtractor: (item: T) => string) =>
  (array: T[]) =>
    array.reduce<T[]>((acc, item) => {
      const key = keyExtractor(item);
      if (!acc.some((existingItem) => keyExtractor(existingItem) === key)) {
        acc.push(item);
      }
      return acc;
    }, []);
