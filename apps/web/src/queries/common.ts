import {
  type FieldPath,
  type LoadSubsetOptions,
  parseOrderByExpression,
  parseWhereExpression,
} from "@tanstack/db";
import { asc, desc, eq, gt, gte, lt, lte, type SQL } from "drizzle-orm";
import type {
  SQLiteColumn,
  SQLiteTableWithColumns,
  TableConfig,
} from "drizzle-orm/sqlite-core";
import SuperJSON from "superjson";

export type SanitizedLoadedSubsetOptions = Omit<
  LoadSubsetOptions,
  "subscription"
>;

export const castAsSanitizedLoadedSubsetOptions = (
  data: unknown
): SanitizedLoadedSubsetOptions | undefined => {
  if (typeof data === "string") {
    return SuperJSON.parse<SanitizedLoadedSubsetOptions | undefined>(data);
  }
  throw new Error("Invalid loaded subset options");
};

export const santizedLoadedSubsetOptions = (
  options?: LoadSubsetOptions
): SanitizedLoadedSubsetOptions | undefined => {
  return options
    ? {
        cursor: options.cursor,
        offset: options.offset,
        limit: options.limit,
        orderBy: options.orderBy,
        where: options.where,
      }
    : undefined;
};

export const parseLoadSubsetOptionsForAuth = (
  options?: SanitizedLoadedSubsetOptions
) => {
  const offset = options?.offset;
  const where = options?.where;
  const limit = options?.limit;
  const orderBy = options?.orderBy;

  // Use custom handlers to match your API's format
  const filters = parseWhereExpression(where, {
    handlers: {
      eq: (field, value) => ({
        filterOperator: "eq",
        filterField: field,
        filterValue: value,
      }),
      ne: (field, value) => ({
        filterOperator: "ne",
        filterField: field,
        filterValue: value,
      }),
      lt: (field, value) => ({
        filterOperator: "lt",
        filterField: field,
        filterValue: value,
      }),
      lte: (field, value) => ({
        filterOperator: "lte",
        filterField: field,
        filterValue: value,
      }),
      gt: (field, value) => ({
        filterOperator: "gt",
        filterField: field,
        filterValue: value,
      }),
      gte: (field, value) => ({
        filterOperator: "gte",
        filterField: field,
        filterValue: value,
      }),
      ilike: (field, value) => ({
        filterOperator: "contains",
        filterField: field,
        filterValue: value,
      }),
    },
  });

  const sort = parseOrderByExpression(orderBy).at(0);
  const sortDirection = sort?.direction;
  const sortBy = sort?.field.toString();

  return {
    ...filters,
    offset,
    limit,
    sortBy,
    sortDirection,
  };
};

export const parseSubsetOptionsForDB = <T extends TableConfig>(
  table: SQLiteTableWithColumns<T>,
  options?: SanitizedLoadedSubsetOptions
) => {
  const offset = options?.offset;
  const where = options?.where;
  const limit = options?.limit;
  const orderBy = options?.orderBy;

  const filters: SQL[] = [];
  const sorts: SQL[] = [];

  const addToFiltersWhenKeyFound = (
    key: unknown,
    value: unknown,
    operation: (left: SQLiteColumn, right: unknown) => SQL
  ) => {
    if (typeof key === "string" && Object.keys(table).includes(key)) {
      const column = table[key];
      filters.push(operation(column, value));
    }
  };

  const addToSortWhenKeyFound = (direction: "asc" | "desc", key: FieldPath) => {
    const field = key.at(0);
    if (typeof field === "string" && Object.keys(table).includes(field)) {
      const column = table[field];
      sorts.push(direction === "asc" ? asc(column) : desc(column));
    }
  };

  parseWhereExpression(where, {
    handlers: {
      eq: (field, value) => {
        addToFiltersWhenKeyFound(field, value, eq);
      },
      gt: (field, value) => {
        addToFiltersWhenKeyFound(field, value, gt);
      },
      gte: (field, value) => {
        addToFiltersWhenKeyFound(field, value, gte);
      },
      lt: (field, value) => {
        addToFiltersWhenKeyFound(field, value, lt);
      },
      lte: (field, value) => {
        addToFiltersWhenKeyFound(field, value, lte);
      },
    },
  });

  const orderByParsed = parseOrderByExpression(orderBy);

  for (const order of orderByParsed) {
    addToSortWhenKeyFound(order.direction, order.field);
  }

  return {
    offset,
    limit,
    filters,
    sorts,
  };
};

export type ParsedSubsetOptionsForDB<T extends TableConfig> = ReturnType<
  typeof parseSubsetOptionsForDB<T>
>;

export type ParsedLoadSubsetOptionsForAuth = ReturnType<
  typeof parseLoadSubsetOptionsForAuth
>;
