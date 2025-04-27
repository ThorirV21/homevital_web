import { useState } from "react";
import { WorkerDTO } from "@/types/types";
import { Button } from "../ui/button";
import useTeams from "@/hooks/useWorker";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useHealthcareWorkerMutations } from "@/hooks/useWorkers";

const NewStaffForm = ({
  user,
  setDialogOpen,
  creating,
}: {
  user: WorkerDTO | null;
  setDialogOpen: (open: boolean) => void;
  creating: boolean;
}) => {
  const { createMutation, updateMutation, deleteMutation } =
    useHealthcareWorkerMutations();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    team: user?.teamIDs || [],
    status: user?.status || "",
    ssn: user?.ssn || "",
  });

  const { teams, isLoading } = useTeams(user?.id || 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("trying to submit");
    if (creating) {
      createMutation.mutate({
        name: formData.name,
        phone: formData.phone,
        teamIDs: formData.team,
        status: formData.status,
        ssn: formData.ssn,
        id: 0,
      });
    } else {
      updateMutation.mutate({
        name: formData.name,
        phone: formData.phone,
        teamIDs: formData.team,
        status: formData.status,
        ssn: formData.ssn,
        id: user?.id || 0,
      });
    }
    console.log("submitted");
    setDialogOpen(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate(`${user?.id}`);
    setDialogOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Label htmlFor="name">Nafn</Label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <Label htmlFor="phone">Sími</Label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <Label htmlFor="team">Teymi</Label>
        <div className="flex gap-2 pl-1">
          {teams.map((team) => (
            <div key={team.id} className="flex gap-2">
              <Checkbox key={team.id} value={team.id} />
              <Label>{team.name}</Label>
            </div>
          ))}
        </div>
        <Label htmlFor="status">Staða</Label>
        <input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border-2 border-gray-300 rounded-md p-2"
        />
        <div className="flex gap-2">
          <Button
            className="w-24 mt-4 bg-destructive text-destructive-foreground"
            type="button"
            onClick={handleDelete}
          >
            Eyða
          </Button>
          <Button className="w-24 ml-auto mt-4" type="submit">
            Vista
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewStaffForm;
