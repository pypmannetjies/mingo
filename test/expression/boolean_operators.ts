import test from "tape";

import { aggregate } from "../../src";
import { runTest } from "../support";

runTest("Boolean Expression Operators", {
  $and: [
    [{ $and: [1, "green"] }, true],
    [{ $and: [] }, true],
    [{ $and: [[null], [false], [0]] }, true],
    [{ $and: [null, true] }, false],
    [{ $and: [0, true] }, false],
  ],
  $not: [
    [{ $not: [true] }, false],
    [{ $not: [[false]] }, false],
    [{ $not: [false] }, true],
    [{ $not: [null] }, true],
    [{ $not: [0] }, true],
    [{ $not: [0, 1] }, "should throw error", { err: true }],
    // single values
    [{ $not: true }, false],
    [{ $not: 0 }, true],
    [{ $not: "string" }, false],
    [{ $not: [] }, false],
  ],
  $or: [
    [{ $or: [true, false] }, true],
    [{ $or: [[false], false] }, true],
    [{ $or: [null, 0, undefined] }, false],
    [{ $or: [] }, false],
  ],
});

test("Boolean Operators: More Examples", (t) => {
  const inventory = [
    { _id: 1, item: "abc1", description: "product 1", qty: 300 },
    { _id: 2, item: "abc2", description: "product 2", qty: 200 },
    { _id: 3, item: "xyz1", description: "product 3", qty: 250 },
    { _id: 4, item: "VWZ1", description: "product 4", qty: 300 },
    { _id: 5, item: "VWZ2", description: "product 5", qty: 180 },
  ];

  let result = aggregate(inventory, [
    {
      $project: {
        item: 1,
        result: { $and: [{ $gt: ["$qty", 100] }, { $lt: ["$qty", 250] }] },
      },
    },
  ]);

  t.deepEqual(
    [
      { _id: 1, item: "abc1", result: false },
      { _id: 2, item: "abc2", result: true },
      { _id: 3, item: "xyz1", result: false },
      { _id: 4, item: "VWZ1", result: false },
      { _id: 5, item: "VWZ2", result: true },
    ],
    result,
    "can apply $and operator"
  );

  result = aggregate(inventory, [
    {
      $project: {
        item: 1,
        result: { $or: [{ $gt: ["$qty", 250] }, { $lt: ["$qty", 200] }] },
      },
    },
  ]);

  t.deepEqual(
    [
      { _id: 1, item: "abc1", result: true },
      { _id: 2, item: "abc2", result: false },
      { _id: 3, item: "xyz1", result: false },
      { _id: 4, item: "VWZ1", result: true },
      { _id: 5, item: "VWZ2", result: true },
    ],
    result,
    "can apply $or aggregate operator"
  );

  result = aggregate(inventory, [
    {
      $project: {
        item: 1,
        result: { $not: [{ $gt: ["$qty", 250] }] },
      },
    },
  ]);

  t.deepEqual(
    [
      { _id: 1, item: "abc1", result: false },
      { _id: 2, item: "abc2", result: true },
      { _id: 3, item: "xyz1", result: true },
      { _id: 4, item: "VWZ1", result: false },
      { _id: 5, item: "VWZ2", result: true },
    ],
    result,
    "can apply $not aggregate operator"
  );

  result = aggregate(inventory, [
    {
      $project: {
        item: 1,
        result: { $in: ["$item", ["abc1", "abc2"]] },
      },
    },
  ]);

  t.deepEqual(
    [
      { _id: 1, item: "abc1", result: true },
      { _id: 2, item: "abc2", result: true },
      { _id: 3, item: "xyz1", result: false },
      { _id: 4, item: "VWZ1", result: false },
      { _id: 5, item: "VWZ2", result: false },
    ],
    result,
    "can apply $in aggregate operator"
  );

  result = aggregate(inventory, [
    {
      $project: {
        item: 1,
        result: { $nin: ["$item", ["abc1", "abc2"]] },
      },
    },
  ]);

  t.deepEqual(
    [
      { _id: 1, item: "abc1", result: false },
      { _id: 2, item: "abc2", result: false },
      { _id: 3, item: "xyz1", result: true },
      { _id: 4, item: "VWZ1", result: true },
      { _id: 5, item: "VWZ2", result: true },
    ],
    result,
    "can apply $nin aggregate operator"
  );

  t.end();
});
