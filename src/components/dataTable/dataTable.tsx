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
  getPaginationRowModel,
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
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import useDebounce from "@/hooks/useDebounce";
import { Button } from "../ui/button";
import { arrayIncludesFilter } from "./multiSelectFilter";
import { DataTablePagination } from "./pagination";

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
  usePagination?: boolean | false;
  onRowClick?: (row: TData) => void;
  selectedRow?: TData | null;
  setColumnFilters?: (columnFilters: ColumnFiltersState) => void;
  columnFilters?: ColumnFiltersState;
  buttons?: ButtonProps[];
  onPageChange?: (pageIndex: number, pageSize: number) => void;
  totalCount?: number;
  initialPage?: number;
  initialPageSize?: number;
  manualPagination?: boolean;
  pageCount?: number;
  showHeader?: boolean;
  maxTableHeight?: string;
}

/**
 *
 * @param columns is an array of column definitions - ColumnDef<TData, TValue>[]
 * @param data is an array of data - TData[]
 * @param name is the name of the table - string
 * @param usePagination is a boolean that determines if pagination is used - boolean | false
 * @param onRowClick is a function that is called when a row is clicked - (row: TData) => void
 * @param selectedRow is the selected row - TData | null
 * @param setColumnFilters is a function that is called when the column filters change - (columnFilters: ColumnFiltersState) => void
 * @param columnFilters is an array of column filters - ColumnFiltersState
 * @param buttons is an array of filter buttons - ButtonProps[]
 * @param onPageChange is a function that is called when the page changes - (pageIndex: number, pageSize: number) => void | undefined
 * @param totalCount is the total number of rows - number | undefined
 * @param initialPage is the initial page - number
 * @param initialPageSize is the initial page size - number
 * @param manualPagination is a boolean that determines if manual pagination is used - boolean
 * @param pageCount is the total number of pages - number | undefined
 * @param showHeader is a boolean that determines if the header is shown, default is true - boolean
 * @param maxTableHeight is the height of the table, default is "max-h-[calc(100vh-230px)]" - string
 */
const DataTable = <TData extends BaseRow, TValue>({
  columns,
  data,
  name,
  usePagination = false,
  onRowClick,
  selectedRow,
  setColumnFilters,
  columnFilters = [],
  buttons,
  onPageChange,
  totalCount,
  initialPage = 0,
  initialPageSize = 10,
  manualPagination = false,
  pageCount,
  showHeader = true,
  maxTableHeight = "max-h-[calc(100vh-230px)]",
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [paginationState, setPaginationState] = useState({
    pageIndex: initialPage,
    pageSize: initialPageSize,
  });

  // Track if we're in the middle of a pagination update
  const isUpdatingPagination = useRef(false);

  // Memoize pagination to prevent unnecessary re-renders
  const pagination = useMemo(() => paginationState, [paginationState]);

  // Synchronize pagination state with initialPage/initialPageSize when they change
  useEffect(() => {
    setPaginationState({
      pageIndex: initialPage,
      pageSize: initialPageSize,
    });
  }, [initialPage, initialPageSize]);

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      if (setColumnFilters) {
        const newValue =
          typeof updater === "function" ? updater(columnFilters) : updater;
        setColumnFilters(newValue);
      }
    },
    [setColumnFilters, columnFilters]
  );

  const handlePaginationChange: OnChangeFn<{
    pageIndex: number;
    pageSize: number;
  }> = useCallback(
    (updaterOrValue) => {
      // Skip if we're already in the middle of a pagination update
      if (isUpdatingPagination.current) return;

      isUpdatingPagination.current = true;

      setPaginationState((oldPagination) => {
        const newPagination =
          typeof updaterOrValue === "function"
            ? updaterOrValue(oldPagination)
            : updaterOrValue;

        // Only call onPageChange if something actually changed
        if (
          onPageChange &&
          (oldPagination.pageIndex !== newPagination.pageIndex ||
            oldPagination.pageSize !== newPagination.pageSize)
        ) {
          onPageChange(newPagination.pageIndex, newPagination.pageSize);
        }

        return newPagination;
      });

      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingPagination.current = false;
      }, 100);
    },
    [onPageChange]
  );

  const calculatedPageCount = useMemo(
    () =>
      pageCount ||
      (totalCount ? Math.ceil(totalCount / pagination.pageSize) : undefined),
    [pageCount, totalCount, pagination.pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: handleColumnFiltersChange,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    ...(usePagination && {
      getPaginationRowModel: manualPagination
        ? undefined
        : getPaginationRowModel(),
      onPaginationChange: handlePaginationChange,
      manualPagination: manualPagination,
      pageCount: manualPagination ? calculatedPageCount : undefined,
    }),
    filterFns: {
      arrayIncludesFilter,
    },
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      globalFilter: debouncedGlobalFilter,
      ...(usePagination && { pagination }),
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex flex-row flex-wrap gap-2 items-center p-4">
          <h2 className="text-xl">{name}</h2>
          <div className="flex flex-row gap-2 items-center flex-wrap">
            {buttons?.map((button) => (
              <Button
                key={button.label}
                variant={button.selected ? "default" : "outline"}
                onClick={button.onClick}
              >
                {button.label}
              </Button>
            ))}
            <Input
              placeholder="Leita..."
              className="w-48"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
            />
          </div>
        </div>
      )}
      <div
        className={`${maxTableHeight ? `overflow-auto ${maxTableHeight}` : ""}`}
      >
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
          <TableBody className={maxTableHeight ? "" : "h-full"}>
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
      {usePagination && (
        <div className="flex flex-row justify-end p-4">
          <DataTablePagination table={table} totalCount={totalCount} />
        </div>
      )}
    </div>
  );
};

export default DataTable;
