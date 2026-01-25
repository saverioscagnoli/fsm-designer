type ForProps<T> = {
  of: Array<T>;
  children: (item: T, index: number) => void;
};

const For = <T,>({ of, children }: ForProps<T>) => {
  return <>{of.map((item, i) => children(item, i))}</>;
};

export { For };
