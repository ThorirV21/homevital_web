import { SortingFn } from "@tanstack/react-table";

/*eslint-disable @typescript-eslint/no-explicit-any*/
export const sorting: SortingFn<any> = (rowA, rowB, columnId) => {
  const valueA = String(rowA.getValue(columnId)).toLowerCase();
  const valueB = String(rowB.getValue(columnId)).toLowerCase();
  return valueA.localeCompare(valueB, "is", { sensitivity: "base" });
};
