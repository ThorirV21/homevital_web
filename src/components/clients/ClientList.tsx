"use client";
import { clientListProps } from "@/types/types";
import * as React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Filter from "../filter";

export interface filterProps {
  status: string[];
  teamId: boolean;
}

export const columns: ColumnDef<clientListProps>[] = [
  {
    accessorKey: "name",
    header: "Nafn",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "address",
    header: "Heimilisfang",
    cell: ({ row }) => row.getValue("address"),
  },
  {
    accessorKey: "teamID",
    header: "Teymi",
    cell: ({ row }) => row.getValue("teamID"),
  },
  {
    accessorKey: "status",
    header: "",
    cell: ({ row }) => (
      <Image
        src={`/status_${row.getValue("status")}.svg`}
        alt="Status"
        width={20}
        height={20}
      />
    ),
  },
];

const ClientList = ({ data }: { data: clientListProps[] }) => {
  const router = useRouter();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [filter, setFilter] = React.useState<filterProps>({
    status: [],
    teamId: false,
  });
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true;

      const rowString = Object.values(row.original).join(" ".toLowerCase());

      return rowString.includes(filterValue.toLowerCase());
    },
  });

  const handleRowClick = (id: number) => {
    router.push(`?id=${id}`, { scroll: false });
  };

  return (
    <div className="">
      <div className="flex flex-row items-center gap-5 my-2">
        <p className="text-xl px-2">Skjólstæðingar</p>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger>
            <div className="inline-flex rounded-2xl ml-auto pr-2">
              <p className="text-xl pr-5">Sía</p>
              <Image src="/Tune.svg" alt="Filter" width={30} height={30} />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <Filter
              filters={filter}
              setFilters={setFilter}
              setPopoverOpen={setPopoverOpen}
            />
          </PopoverContent>
        </Popover>

        <Input
          className="mx-2 rounded-xl bg-input text-foreground w-80"
          placeholder="Search"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
        />
      </div>
      <Separator />
      <div className="pt-2">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-foreground font-bold"
                    >
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => handleRowClick(row.original.id)}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export { ClientList };
