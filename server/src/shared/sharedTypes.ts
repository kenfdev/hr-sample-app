export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type PrimitivePropertyNames<T> = {
  [K in keyof T]: T[K] extends number | string | boolean ? K : never;
}[keyof T];
