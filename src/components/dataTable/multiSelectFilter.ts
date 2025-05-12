import { FilterFn } from "@tanstack/react-table";

/*eslint-disable @typescript-eslint/no-explicit-any*/
const arrayIncludesFilter: FilterFn<any> = (row, columnId, filterValue) => {
  if (filterValue.length === 0) return true;

  const filterValueArray = filterValue.map((value: string) => value.trim());
  console.log("filterValueArray", filterValueArray);
  const rowValue = row.original[columnId];
  console.log("rowValue", rowValue);
  return filterValueArray.some((value: string) => rowValue.includes(value));
};

export { arrayIncludesFilter };
