"use client";
import * as React from "react";
//import { clientListProps } from "@/types/types";
import { ClientList } from "@/components/clients/ClientList";
import { useClients } from "@/hooks/useClients";

/* const data: clientListProps[] = [
  {
    id: 1,
    name: "Jón Jónsson",
    address: "Hörgárbraut 1",
    team: "Hjúkrunarlið 1",
    status_Logo: "green",
  },
  {
    id: 2,
    name: "Guðrún Guðmundsdóttir",
    address: "Hörgárbraut 2",
    team: "Hjúkrunarlið 2",
    status_Logo: "yellow",
  },
  {
    id: 3,
    name: "Pétur Pétursson",
    address: "Hörgárbraut 3",
    team: "Hjúkrunarlið 3",
    status_Logo: "red",
  },
]; */

export default function Clients() {
  const { patients, error, isLoading } = useClients();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="">
      <ClientList data={patients} />
    </div>
  );
}
