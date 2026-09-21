export type Expand<T> = { [K in keyof T]: T[K] }
export type ExpandR<T> = T extends object ? (T extends infer O ? { [K in keyof O]: ExpandR<O[K]> } : never) : T
