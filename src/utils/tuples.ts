export function tuple<T extends unknown[] | [unknown]>(arr: T ) {
  return arr;
}

export type Tuple<TItem, TLength extends number> = ([TItem, ...TItem[]] & { length: TLength }) | [] & {length: 0};