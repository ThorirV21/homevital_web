"use client";

import { MeasurementValue } from "@/types/clientTypes";
import { ColumnDef } from "@tanstack/react-table";
import Sitting from "../icons/sitting";
import InBed from "../icons/inBed";
import TooltipInfo from "../tooltipInfo";
import Hand from "../icons/hand";
import { Circle } from "lucide-react";
import Lungs from "../icons/lungs";
import Scale from "../icons/scale";
import BloodSugar from "../icons/bloodSugar";
import Heart from "../icons/heart";
import formatDateIS from "@/services/dateFormatter";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import BodyTemp from "../icons/bodyTemp";
import { arrayIncludesFilter } from "./multiSelectFilter";
import { getStatusText } from "@/lib/utils";
import { sorting } from "@/components/dataTable/sorting";

export interface Warning {
  id: number;
  measurementDate: string;
  name: string;
  measurementType: string;
  measurementValues: MeasurementValue;
  team: string;
  status: string;
}

export const warningColumns: ColumnDef<Warning>[] = [
  {
    accessorKey: "measurementDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mælingardagur
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return formatDateIS(row.original.measurementDate);
    },
  },
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
      const client = row.original.name;
      return client;
    },
  },
  {
    accessorKey: "measurementType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tegund
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const measurementType = row.original.measurementType;
      if (measurementType === "BodyTemperature") {
        return (
          <div className="flex items-center justify-center">
            <TooltipInfo info="Hitamæling" className="text-md">
              <BodyTemp className="w-5 h-5" />
            </TooltipInfo>
          </div>
        );
      } else if (measurementType === "OxygenSaturation") {
        return (
          <div className="flex items-center justify-center">
            <TooltipInfo info="Súrefnismettun" className="text-md">
              <Lungs className="w-5 h-5" />
            </TooltipInfo>
          </div>
        );
      } else if (measurementType === "BodyWeight") {
        return (
          <div className="flex items-center justify-center">
            <TooltipInfo info="Þyngd" className="text-md">
              <Scale className="w-5 h-5" />
            </TooltipInfo>
          </div>
        );
      } else if (measurementType === "BloodSugar") {
        return (
          <div className="flex items-center justify-center">
            <TooltipInfo info="Blóðsykur" className="text-md">
              <BloodSugar className="w-5 h-5" />
            </TooltipInfo>
          </div>
        );
      } else if (measurementType === "BloodPressure") {
        return (
          <div className="flex items-center justify-center">
            <TooltipInfo info="Blóðþrýstingur" className="text-md">
              <Heart className="w-5 h-5" />
            </TooltipInfo>
          </div>
        );
      }
      return measurementType;
    },
  },
  {
    accessorKey: "measurementValues",
    header: "Mælingar",
    cell: ({ row }) => {
      const measurementValues = row.original.measurementValues;
      if (row.original.measurementType === "BodyTemperature") {
        return `${measurementValues.temperature} °C`;
      } else if (row.original.measurementType === "OxygenSaturation") {
        return `${measurementValues.oxygenSaturation} %`;
      } else if (row.original.measurementType === "BodyWeight") {
        return `${measurementValues.weight} Kg`;
      } else if (row.original.measurementType === "BloodSugar") {
        return `${measurementValues.bloodSugar} mmól/L`;
      } else if (row.original.measurementType === "BloodPressure") {
        return (
          <div className="flex gap-6">
            <p>SYS {measurementValues.systolic}</p>
            <p>DIA {measurementValues.diastolic}</p>
            <p>Púls {measurementValues.bpm}</p>
            <div className="ml-auto flex">
              {measurementValues.bodyPosition === "Sitting" ? (
                <TooltipInfo info="Sitjandi" className="text-md">
                  <Sitting className="" />
                </TooltipInfo>
              ) : measurementValues.bodyPosition === "Laying" ? (
                <TooltipInfo info="Liggjandi" className="text-md">
                  <InBed className="" />
                </TooltipInfo>
              ) : null}
              <TooltipInfo
                className="text-md"
                info={
                  measurementValues.measureHand === "Right"
                    ? "Vinstri hönd"
                    : measurementValues.measureHand === "Left"
                      ? "Hægri hönd"
                      : ""
                }
              >
                <Hand
                  className={`mx-2 ${measurementValues.measureHand === "Right" ? "flip-horizontal" : ""}`}
                />
              </TooltipInfo>
            </div>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "team",
    filterFn: arrayIncludesFilter,
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
    cell: ({ row }) => {
      const team = row.original.team;
      return team;
    },
    meta: {
      filterVariant: "multi-select",
    },
  },
  {
    accessorKey: "status",
    filterFn: arrayIncludesFilter,
    header: "Staða",
    cell: ({ row }) => {
      const status = row.original.measurementValues.status;
      const statusText = getStatusText(status);

      return (
        <TooltipInfo info={statusText} className="text-md">
          <Circle className={`w-4 h-4 mx-auto ${status}`} />
        </TooltipInfo>
      );
    },
    meta: {
      filterVariant: "multi-select",
    },
  },
];
