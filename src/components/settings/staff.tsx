import { useHealthcareWorkers } from "@/hooks/useWorkers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StaffForm from "./staffForm";
import { WorkerDTO } from "@/types/types";
import { Button } from "@/components/ui/button";
import Loading from "../loading";

const StaffView = () => {
  const { data, error, isLoading } = useHealthcareWorkers();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No staff found</div>;
  }

  console.table(data);

  return (
    <div className="flex flex-col w-3/4">
      {data.map((worker: WorkerDTO) => (
        <Dialog key={worker.id}>
          <DialogTrigger key={worker.id}>
            <div
              key={worker.id}
              className="flex items-center justify-between p-4 border-b border-gray-300"
            >
              <p>{worker.name}</p>
              <p>{worker.phone}</p>
              <p>{worker.teamID}</p>
              <p>{worker.status}</p>
            </div>
          </DialogTrigger>
          <DialogContent className="bg-secondary">
            <DialogHeader>
              <DialogTitle>Breyta</DialogTitle>
              <DialogDescription>
                Breyttu gildum og ýttu á vista.
              </DialogDescription>
            </DialogHeader>
            <StaffForm user={worker} />
          </DialogContent>
        </Dialog>
      ))}
      <div className="ms-auto mt-auto p-4">
        <Button
          className="mt-4"
          onClick={() => console.log("Create new staff")}
        >
          Bæta við starfsfólki
        </Button>
      </div>
    </div>
  );
};

export default StaffView;
