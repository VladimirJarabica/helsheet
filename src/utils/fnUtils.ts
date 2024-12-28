import { compose, map, mapObjIndexed, groupBy, prop, head } from "ramda";

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export const groupByProp =
  <T>(property: keyof T) =>
  (arr: T[]): { [index: string]: T } =>
    // @ts-ignore
    compose<T[], { [index: string]: T[] }, { [index: string]: T }>(
      // @ts-ignore
      map(head),
      // @ts-ignore
      groupBy(prop(property))
      // @ts-ignore
    )(arr);

export const groupByFn =
  <T>(fn: (item: T) => string) =>
  (arr: T[]): { [index: string]: T } =>
    // @ts-ignore
    compose<T[], { [index: string]: T[] }, { [index: string]: T }>(
      mapObjIndexed<T[], T, string>(head),
      // @ts-ignore
      groupBy<T>(fn)
      // @ts-ignore
    )(arr);
