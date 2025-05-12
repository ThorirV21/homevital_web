"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import formatPhoneNumber from "@/services/phoneNumberFormatter";
import { arrayIncludesFilter } from "./multiSelectFilter";
import { sorting } from "@/components/dataTable/sorting";

export interface WorkerRow {
  id: number;
  name: string;
  phone: string;
  teamNames: string[];
}

export const workerColumns: ColumnDef<WorkerRow>[] = [
  {
    accessorKey: "name",
    sortingFn: sorting,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nafn
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{row.original.name}</p>;
    },
  },
  {
    accessorKey: "phone",
    header: "Sími",
    cell: ({ row }) => {
      return <p>{formatPhoneNumber(row.original.phone)}</p>;
    },
  },
  {
    accessorKey: "teamNames",
    header: "Teymi",
    filterFn: arrayIncludesFilter,
    cell: ({ row }) => {
      return <p>{row.original.teamNames.join(", ")}</p>;
    },
    meta: {
      filterVariant: "multi-select",
    },
  },
];
