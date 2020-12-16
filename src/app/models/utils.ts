export type FreezeDry<T, S extends keyof T> = Omit<T, S> & {[K in S]: [T[K]] extends [unknown[]] ? number[] : number}

type C<A> = A extends unknown[] ? number : string;