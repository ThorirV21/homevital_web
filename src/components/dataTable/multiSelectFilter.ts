import { FilterFn } from "@tanstack/react-table";

/*eslint-disable @typescript-eslint/no-explicit-any*/
const arrayIncludesFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const rowValue = row.original[columnId];
  return filterValue.length === 0 ? true : filterValue.includes(rowValue);
};

export { arrayIncludesFilter };
