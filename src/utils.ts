import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { NoInfer } from "@reduxjs/toolkit/dist/tsHelpers";

export function includesAll(
  textToCheck: string,
  ...texts: string[]
): boolean {
  return texts.every((text) => textToCheck.includes(text));
}

export function isFunction_(
  check: any
): check is (
  builder: ActionReducerMapBuilder<NoInfer<any>>
) => void {
  return {}.toString.call(check) === "[object Function]";
}
