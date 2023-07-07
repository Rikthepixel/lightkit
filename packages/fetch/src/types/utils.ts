export type MaybePromise<TResult> = TResult | PromiseLike<TResult>;
export type SetRequired<T extends {}, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;