'use client';
import { clientListProps } from '@/types/types';
import * as React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';

export const columns: ColumnDef<clientListProps>[] = [
  {
    accessorKey: 'name',
    header: 'Nafn',
    cell: ({ row }) => row.getValue('name'),
  },
  {
    accessorKey: 'address',
    header: 'Heimilisfang',
    cell: ({ row }) => row.getValue('address'),
  },
  {
    accessorKey: 'team',
    header: 'Teymi',
    cell: ({ row }) => row.getValue('team'),
  },
  {
    accessorKey: 'status_Logo',
    header: '',
    cell: ({ row }) => (
      <Image
        src={`/status_${row.getValue('status_Logo')}.svg`}
        alt="Status"
        width={20}
        height={20}
      />
    ),
  },
];

const ClientList = ({ data }: { data: clientListProps[] }) => {
  const router = useRouter();
  const [filter, setFilter] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters: filter,
    },
  });

  const handleRowClick = (id: number) => {
    router.push(`?id=${id}`, { scroll: false });
  };

  return (
    <div className="">
      <div className="flex flex-row items-center gap-5 my-2">
        <p className="text-xl px-2">Skjólstæðingar</p>
        <div className="inline-flex rounded-2xl ml-auto pr-2">
          <p className="text-xl pr-5">Sía</p>
          <Image src="/Tune.svg" alt="Filter" width={30} height={30} />
        </div>

        <Input
          className="mx-2 rounded-xl bg-input text-foreground w-80"
          placeholder="Search"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div>
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
