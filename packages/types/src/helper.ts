import type z from "zod";
import type { ZodType } from "zod";

export type SchemaType<T extends ZodType> = z.output<T>;
