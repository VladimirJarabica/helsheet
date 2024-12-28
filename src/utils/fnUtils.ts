import { compose, map, mapObjIndexed, groupBy, prop, head } from "ramda";

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export const groupByProp =
  <T>(property: keyof T) =>
  (arr: T[]): { [index: string]: T } =>
    // @ts-expect-error because
    compose<T[], { [index: string]: T[] }, { [index: string]: T }>(
      // @ts-expect-error because
      map(head),
      // @ts-expect-error because
      groupBy(prop(property))
      // @ts-expect-error because
    )(arr);

export const groupByFn =
  <T>(fn: (item: T) => string) =>
  (arr: T[]): { [index: string]: T } =>
    // @ts-expect-error because
    compose<T[], { [index: string]: T[] }, { [index: string]: T }>(
      mapObjIndexed<T[], T, string>(head),
      // @ts-expect-error because
      groupBy<T>(fn)
      // @ts-expect-error because
    )(arr);
