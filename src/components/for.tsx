import { Fragment, type ReactNode } from "react";

type ForProps<T> = {
  of: Array<T>;
  fallback?: ReactNode;
  children: (item: T, index: number) => ReactNode;
};

const For = <T,>({ of, fallback, children }: ForProps<T>) => {
  return (
    <>
      {of.length === 0
        ? fallback
        : of.map((item, i) => (
            <Fragment key={i.toString()}>{children(item, i)}</Fragment>
          ))}
    </>
  );
};

export { For };
