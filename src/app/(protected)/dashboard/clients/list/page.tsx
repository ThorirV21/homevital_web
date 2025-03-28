"use client";
import * as React from "react";
import { useClients } from "@/hooks/useClients";
import Loading from "@/components/loading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Client } from "@/types/clientTypes";
import Error from "@/components/error";
import NewFilter from "@/components/newFilter";
import { FilterProps } from "@/types/filterTypes";

// TODO: Get this from the backend
const items: FilterProps = {
  header: "sía",
  description:
    "Hakaðu í þær tegundir af viðvörunum sem þú vilt skoða. Veldu allar tegundir til að sjá allt.",
  items: [
    {
      id: "utan-marka",
      name: "Utan marka",
      checked: false,
    },
    {
      id: "rett-utan-marka",
      name: "Rétt utan marka",
      checked: false,
    },
    {
      id: "skraningar-i-sogu",
      name: "Skráningar í sögu",
      checked: false,
    },
    {
      id: "aatlun-lokid",
      name: "Áætlun lokið",
      checked: false,
    },
    {
      id: "min-teymi",
      name: "Mín teymi",
      checked: false,
    },
    {
      id: "allt",
      name: "Allar tegundir viðvarana",
      checked: false,
    },
  ],
};

export default function Clients() {
  const router = useRouter();
  const { patients, error, isLoading } = useClients();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filter, setFilter] = useState<FilterProps>(items);

  const [hoveredPatient, setHoveredPatient] = useState<Client | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Client | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setSelectedPatient(
        patients?.find((patient) => patient.id === parseInt(id as string)) ||
          null
      );
    }
  }, [searchParams, patients]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  const handleClickPatient = (patient: Client) => {
    setSelectedPatient(patient);
    router.push(`?id=${patient.id}`, { scroll: false });
  };

  return (
    <div className="">
      {/* <ClientList data={patients} /> */}

      <div className="flex flex-row items-center gap-5 my-2">
        <p className="text-xl px-2">Skjólstæðingar</p>
        <NewFilter
          setPopoverOpen={setPopoverOpen}
          filters={filter}
          setFilters={setFilter}
          popoverOpen={popoverOpen}
        />
        <Input
          className="mx-2 rounded-xl bg-input text-foreground w-80"
          placeholder="Search"
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
        />
      </div>
      <Separator />
      <div className="pt-2">
        <table className="w-full">
          <thead>
            <tr className="flex flex-row gap-5 w-full text-left border-b border-gray-400 px-2">
              <th className="w-1/4">Nafn</th>
              <th className="w-1/4">Heimilisfang</th>
              <th className="w-1/4">Teymi</th>
              <th className="w-1/4"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className={`flex flex-row gap-5 w-full p-2 border-b border-gray-300 cursor-pointer ${selectedPatient?.id === patient.id ? "bg-neutral-300" : ""} ${hoveredPatient?.id === patient.id ? "bg-gray-100" : ""}`}
                onClick={() => handleClickPatient(patient)}
                onMouseEnter={() => setHoveredPatient(patient)}
                onMouseLeave={() => setHoveredPatient(null)}
              >
                <td className="w-1/4">{patient.name}</td>
                <td className="w-1/4">{patient.address}</td>
                <td className="w-1/4">{patient.teamID}</td>
                <td className="w-1/4">{patient.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
