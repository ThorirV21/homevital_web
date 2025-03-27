import { useHealthcareWorkers } from "@/hooks/useWorkers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkerDTO } from "@/types/types";
import { Button } from "@/components/ui/button";
import Loading from "../loading";
import NewStaffForm from "./newStaffForm";
import { useState } from "react";

const StaffView = () => {
  const { data, error, isLoading } = useHealthcareWorkers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [worker, setWorker] = useState<WorkerDTO | null>(null);
  const [creating, setCreating] = useState(false);

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
    setCreating(false);
    setDialogOpen(true);
  };

  const handleClickCreate = () => {
    setWorker(null);
    setCreating(true);
    setDialogOpen(true);
  };

  console.table(data);

  return (
    <div className="flex flex-col w-3/4">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="flex flex-row items-center text-left justify-between border-b border-gray-300 p-3">
            <th className="w-1/4">Nafn</th>
            <th className="w-1/4">Sími</th>
            <th className="w-1/4">Teymi</th>
            <th className="w-1/4">Staða</th>
          </tr>
        </thead>
        <tbody>
          {data.map((worker: WorkerDTO) => (
            <tr
              key={worker.id}
              className="flex flex-row items-center justify-between border-b border-gray-300 p-3"
              onClick={() => handleClickWorker(worker)}
            >
              <td className="w-1/4">{worker.name}</td>
              <td className="w-1/4">{worker.phone}</td>
              <td className="w-1/4">{worker.teamID}</td>
              <td className="w-1/4">{worker.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog
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
      </Dialog>
      <div className="ms-auto mt-auto p-4">
        <Button className="mt-4" onClick={handleClickCreate}>
          Bæta við starfsfólki
        </Button>
      </div>
    </div>
  );
};

export default StaffView;
