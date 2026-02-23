import type { ZodSchema } from "zod";

export function castAs<T>(): (value: unknown) => T;
export function castAs<T>(value: unknown): T;
export function castAs<T>(value?: unknown): T | ((value: unknown) => T) {
  if (value === undefined) {
    return (value: unknown): T => value as unknown as T;
  }
  return value as unknown as T;
}

export const safeApiCall =
  <T extends ZodSchema>(schema: T) =>
  async (fn: () => Promise<unknown>) => {
    return await fn().then(schema.parse);
  };
