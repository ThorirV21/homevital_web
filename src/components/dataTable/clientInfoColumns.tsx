"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { sorting } from "@/components/dataTable/sorting";
import formatPhoneNumber from "@/services/phoneNumberFormatter";
import { Badge } from "@/components/ui/badge";
import { arrayIncludesFilter } from "./multiSelectFilter";

export interface ClientInfoRow {
  id: number;
  name: string;
  address: string;
  phone: string;
  status: string;
  team: string;
}

export const clientInfoColumns: ColumnDef<ClientInfoRow>[] = [
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
    cell: ({ row }) => <p>{row.original.name}</p>,
  },
  {
    accessorKey: "address",
    header: "Heimilisfang",
    cell: ({ row }) => <p>{row.original.address}</p>,
  },
  {
    accessorKey: "phone",
    header: "Sími",
    cell: ({ row }) => <p>{formatPhoneNumber(row.original.phone)}</p>,
  },
  {
    accessorKey: "status",
    header: "Staða",
    cell: ({ row }) => {
      const status =
        row.original.status === "Active"
          ? "Í meðferð"
          : row.original.status === "Inactive"
            ? "Óvirkur"
            : "";
      return (
        <Badge
          variant={row.original.status === "Active" ? "default" : "secondary"}
          className={`capitalize border border-primary ${row.original.status === "Active" ? "text-secondary" : "text-primary"}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "team",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Teymi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <p>{row.original.team}</p>,
    filterFn: arrayIncludesFilter,
    meta: {
      filterVariant: "multi-select",
    },
  },
];
