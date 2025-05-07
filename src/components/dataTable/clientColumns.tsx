import { Client } from "@/types/clientTypes";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { arrayIncludesFilter } from "./multiSelectFilter";
import { Badge } from "../ui/badge";
export interface ClientRow extends Client {
  team: string;
}

export const clientColumns: ColumnDef<ClientRow>[] = [
  {
    accessorKey: "name",
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
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "address",
    header: "Heimilisfang",
    cell: ({ row }) => row.original.address,
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
    cell: ({ row }) => row.original.team,
    filterFn: arrayIncludesFilter,
    meta: {
      filterVariant: "multi-select",
    },
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
];
