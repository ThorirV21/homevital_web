import { Team } from "@/types/teamTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { TeamPatch, useTeamMutation } from "@/hooks/useTeams";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "../ui/select";
import { WorkerDTO } from "@/types/types";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(4, "Nafn er nauðsynlegt"),
  teamLeaderID: z.string().min(1, "Veldu teymis stjóra"),
});

type FormShape = z.infer<typeof formSchema>;

export interface TeamConfig {
  header: string;
  infoText: string;
  team: Team | null;
  workers: WorkerDTO[];
}

interface TeamFormProps {
  config: TeamConfig;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TeamForm = ({ config, open, setOpen }: TeamFormProps) => {
  const {
    createTeam,
    updateTeam,
    deleteTeam,
    isSuccessCreateTeam,
    isSuccessUpdateTeam,
    isSuccessDeleteTeam,
    isUpdatingTeam,
    isCreatingTeam,
    isDeletingTeam,
    resetCreateTeam,
    resetUpdateTeam,
    resetDeleteTeam,
  } = useTeamMutation();
  const [selectedTeamLeader, setSelectedTeamLeader] = useState<string>(
    config.team?.teamLeaderID?.toString() || ""
  );

  const form = useForm<FormShape>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: config.team?.name || "",
      teamLeaderID: config.team?.teamLeaderID?.toString() || "",
    },
  });

  useEffect(() => {
    if (isSuccessCreateTeam || isSuccessUpdateTeam || isSuccessDeleteTeam) {
      setOpen(false);
    }
  }, [isSuccessCreateTeam, isSuccessUpdateTeam, isSuccessDeleteTeam, setOpen]);

  useEffect(() => {
    setSelectedTeamLeader(config.team?.teamLeaderID?.toString() || "");

    form.reset({
      name: config.team?.name || "",
      teamLeaderID: config.team?.teamLeaderID?.toString() || "",
    });
  }, [config.team, form]);

  const onSubmit = (values: FormShape) => {
    if (config.team) {
      const patchTeam: TeamPatch = {
        id: config.team.id,
        name: values.name,
        teamLeaderID: parseInt(values.teamLeaderID),
      };
      updateTeam(patchTeam);
    } else {
      createTeam({
        id: 0,
        name: values.name,
        teamLeaderID: parseInt(values.teamLeaderID),
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
    resetCreateTeam();
    resetUpdateTeam();
    resetDeleteTeam();
  };

  const handleDelete = () => {
    deleteTeam(config.team?.id.toString() || "");
    setOpen(false);
  };

  const inputClasses = "bg-background";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.header}</DialogTitle>
          <DialogDescription>{config.infoText}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2" inert={!open}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nafn</FormLabel>
                    <FormControl>
                      <Input className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamLeaderID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teymis stjóri</FormLabel>
                    <Select
                      defaultValue={selectedTeamLeader}
                      value={selectedTeamLeader}
                      onValueChange={(value) => {
                        setSelectedTeamLeader(value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder="Velja teymis stjóra" />
                      </SelectTrigger>
                      <SelectContent>
                        {config.workers.map((worker) => (
                          <SelectItem
                            key={worker.id}
                            value={worker.id.toString()}
                          >
                            {worker.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-2">
                <Button
                  className="mt-6 ml-auto"
                  type="submit"
                  disabled={isUpdatingTeam || isCreatingTeam || isDeletingTeam}
                >
                  {isUpdatingTeam || isCreatingTeam || isDeletingTeam ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Vista"
                  )}
                </Button>
                <Button
                  className="mt-6 bg-destructive"
                  type="button"
                  onClick={handleDelete}
                >
                  Eyða
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamForm;
