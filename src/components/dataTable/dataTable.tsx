"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  RowSelectionState,
  OnChangeFn,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Button } from "../ui/button";
import { arrayIncludesFilter } from "./multiSelectFilter";

interface BaseRow {
  id: number | string;
}

interface ButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

interface DataTableProps<TData extends BaseRow, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  name: string;
  onRowClick?: (row: TData) => void;
  selectedRow?: TData | null;
  setColumnFilters?: (columnFilters: ColumnFiltersState) => void;
  columnFilters?: ColumnFiltersState;
  buttons?: ButtonProps[];
}

const DataTable = <TData extends BaseRow, TValue>({
  columns,
  data,
  name,
  onRowClick,
  selectedRow,
  setColumnFilters,
  columnFilters = [],
  buttons,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  //const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (
    updater
  ) => {
    if (setColumnFilters) {
      const newValue =
        typeof updater === "function" ? updater(columnFilters) : updater;
      setColumnFilters(newValue);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: handleColumnFiltersChange,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    filterFns: {
      arrayIncludesFilter,
    },
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div>
      <div className="flex flex-row gap-2 items-center p-4">
        <h2 className="text-xl">{name}</h2>
        <div className="flex flex-row gap-2 items-center">
          {buttons?.map((button) => (
            <Button
              key={button.label}
              variant="outline"
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Leita..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(String(e.target.value))}
        />
      </div>
      <div className="overflow-auto max-h-[calc(100vh-200px)] px-2">
        <Table className="">
          <TableHeader className="bg-accent sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="max-h-[calc(100vh-400px)] overflow-y-auto">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    row.original.id === selectedRow?.id ? "bg-muted" : ""
                  }
                  data-state={rowSelection[row.id] && "selected"}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Ekkert fannst
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
