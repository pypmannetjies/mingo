import { Options } from "../../core";
import { Iterator } from "../../lazy";
import { Collection, RawObject } from "../../types";
import { assert, isString } from "../../util";

/**
 * Takes the documents returned by the aggregation pipeline and writes them to a specified collection.
 *
 * Unlike the $out operator in MongoDB, this operator can appear in any position in the pipeline and is
 * useful for collecting intermediate results of an aggregation operation.
 *
 * @param collection
 * @param expr
 * @param options
 * @returns {*}
 */
export function $out(
  collection: Iterator,
  expr: string | Collection,
  options?: Options
): Iterator {
  const outputColl: Collection = isString(expr)
    ? options?.collectionResolver(expr)
    : expr;
  assert(outputColl instanceof Array, `expression must resolve to an array`);

  return collection.map((o: RawObject) => {
    outputColl.push(o);
    return o; // passthrough
  });
}
