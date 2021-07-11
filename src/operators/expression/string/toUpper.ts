/**
 * String Expression Operators: https://docs.mongodb.com/manual/reference/operator/aggregation/#string-expression-operators
 */

import { computeValue, Options } from "../../../core";
import { AnyVal, RawObject } from "../../../types";
import { isEmpty } from "../../../util";

/**
 * Converts a string to uppercase.
 *
 * @param obj
 * @param expr
 * @returns {string}
 */
export function $toUpper(
  obj: RawObject,
  expr: AnyVal,
  options?: Options
): AnyVal {
  const value = computeValue(obj, expr, null, options) as string;
  return isEmpty(value) ? "" : value.toUpperCase();
}
