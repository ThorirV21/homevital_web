import { useHealthcareWorkers } from "@/hooks/useWorkers";
/* import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; */
import { WorkerDTO } from "@/types/types";
import { Button } from "@/components/ui/button";
import Loading from "../loading";
/* import NewStaffForm from "./newStaffForm"; */
import { useState } from "react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import StaffForm from "./staffForm";
import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/teamTypes";

const StaffView = () => {
  const { data, error, isLoading } = useHealthcareWorkers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [worker, setWorker] = useState<WorkerDTO | null>(null);
  const { teams } = useTeams();
  const [hoveredWorker, setHoveredWorker] = useState<WorkerDTO | null>(null);
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No staff found</div>;
  }

  const handleClickWorker = (worker: WorkerDTO) => {
    setWorker(worker);
    setDialogOpen(true);
  };

  const handleClickCreate = () => {
    setWorker(null);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row items-center text-left justify-between border-b border-gray-300 p-3">
        <h3 className="w-1/4 font-bold">Nafn</h3>
        <h3 className="w-1/4 font-bold">Sími</h3>
        <h3 className="w-1/4 font-bold">Teymi</h3>
        <h3 className="w-1/4 font-bold">Staða</h3>
      </div>
      <ScrollArea className="overflow-y-auto max-h-[calc(100vh-23rem)] border-b">
        <table className="w-full border-collapse border border-gray-300">
          <thead></thead>
          <tbody>
            {data.map((worker: WorkerDTO) => (
              <tr
                key={worker.id}
                className={`flex flex-row items-center justify-between border-b border-gray-300 p-3 ${hoveredWorker?.id === worker.id ? "bg-gray-100" : ""}`}
                onMouseEnter={() => setHoveredWorker(worker)}
                onMouseLeave={() => setHoveredWorker(null)}
                onClick={() => handleClickWorker(worker)}
              >
                <td className="w-1/4">{worker.name}</td>
                <td className="w-1/4">{worker.phone}</td>
                <td className="w-1/4">
                  {worker.teamIDs
                    .map(
                      (team: number) =>
                        teams.find((t: Team) => t.id === team)?.name
                    )
                    .join(", ")}
                </td>
                <td className="w-1/4">{worker.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
      <StaffForm open={dialogOpen} setOpen={setDialogOpen} staff={worker} />

      {/*       <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        key={"change-staff"}
      >
        <DialogTrigger key={"change-staff-trigger"}></DialogTrigger>
        <DialogContent className="bg-secondary">
          <DialogHeader>
            <DialogTitle>Breyta</DialogTitle>
            <DialogDescription>
              Breyttu gildum og ýttu á vista.
            </DialogDescription>
          </DialogHeader>
          <NewStaffForm
            user={worker}
            setDialogOpen={setDialogOpen}
            creating={creating}
          />
        </DialogContent>
      </Dialog> */}
      <div className="ms-auto mt-auto p-4">
        <Button className="mt-4" onClick={handleClickCreate}>
          Bæta við starfsfólki
        </Button>
      </div>
    </div>
  );
};

export default StaffView;
