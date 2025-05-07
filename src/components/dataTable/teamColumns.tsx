"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { sorting } from "./sorting";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

export interface TeamRow {
  id: number;
  name: string;
  workers: string[];
  patients: string[];
}

// Create a separate component for the workers cell
const PersonsCell = ({ persons }: { persons: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center z-10"
      >
        <span className="mr-2">{persons.length}</span>
        {isOpen ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
      {isOpen && (
        <div className="" onClick={(e) => e.stopPropagation()}>
          {persons.map((person, index) => (
            <p key={index} className="whitespace-nowrap py-1">
              {person}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export const teamColumns: ColumnDef<TeamRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nafn
          <ArrowUp className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <p>{row.original.name}</p>;
    },
    sortingFn: sorting,
  },
  {
    accessorKey: "workers",
    header: "Starfsmenn",
    cell: ({ row }) => <PersonsCell persons={row.original.workers} />,
  },
  {
    accessorKey: "patients",
    header: "Sjúklingar",
    cell: ({ row }) => <PersonsCell persons={row.original.patients} />,
  },
];
