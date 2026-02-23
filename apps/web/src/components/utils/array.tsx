import { Array } from "effect";
import {
  createContext,
  type PropsWithChildren,
  type ReactNode,
  useContext,
} from "react";

export interface NonEmptyArrayContext<T extends unknown[]> {
  data: T;
  isEmpty: boolean;
}

export const nonEmptyArrayContext = createContext<NonEmptyArrayContext<
  unknown[]
> | null>(null);

const useNonEmptyArrayContext = () => {
  const context = useContext(nonEmptyArrayContext);

  if (!context) {
    throw new Error(
      "useNonEmptyArrayContext must be used within a NonEmptyArray"
    );
  }

  return context;
};

export const NonEmptyArray = <T extends unknown[]>({
  children,
  data,
}: PropsWithChildren<{ data: T }>) => {
  const isEmpty = Array.isEmptyArray(data);

  return (
    <nonEmptyArrayContext.Provider value={{ data, isEmpty }}>
      {children}
    </nonEmptyArrayContext.Provider>
  );
};

NonEmptyArray.WhenEmpty = ({ children }: PropsWithChildren) => {
  const { isEmpty } = useNonEmptyArrayContext();

  return isEmpty ? children : null;
};

NonEmptyArray.WhenNonEmpty = <T extends unknown[]>({
  children,
}: {
  children: (data: T) => ReactNode;
}) => {
  const { data, isEmpty } = useNonEmptyArrayContext();

  return isEmpty ? null : children(data as T);
};
