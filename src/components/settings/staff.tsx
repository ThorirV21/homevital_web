import { useHealthcareWorkers } from "@/hooks/useWorkers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Worker {
  id: number;
  name: string;
  phone: string;
  teamID: string;
  status: string;
}

const StaffView = () => {
  const { data, error, isLoading } = useHealthcareWorkers();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No staff found</div>;
  }

  return (
    <div className="flex flex-col w-3/4">
      {data.map((worker: Worker) => (
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Breyta</DialogTitle>
              <DialogDescription>
                Breyttu gildum og ýttu á vista.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col p-4 gap-4 overflow-hidden">
              <div className="flex flex-col gap-2">
                <label>Nafn:</label>
                <input type="text" defaultValue={worker.name} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Sími:</label>
                <input type="text" defaultValue={worker.phone} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Teymi:</label>
                <input type="text" defaultValue={worker.teamID} />
              </div>
              <div className="flex flex-col gap-2">
                <label>Staða:</label>
                <input type="text" defaultValue={worker.status} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default StaffView;
