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
import { useEffect } from "react";
import { Button } from "../ui/button";
import { useTeamMutation } from "@/hooks/useTeams";

const formSchema = z.object({
  name: z.string().min(4, "Nafn er nauðsynlegt"),
});

type FormShape = z.infer<typeof formSchema>;

interface TeamFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  team: Team | null;
}

const TeamForm = ({ open, setOpen, team }: TeamFormProps) => {
  const { createTeam, updateTeam, deleteTeam } = useTeamMutation();

  const form = useForm<FormShape>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: team?.name || "",
    });
  }, [team, form]);

  const onSubmit = (values: FormShape) => {
    console.log(values);

    if (team) {
      updateTeam({
        id: team.id,
        name: values.name,
        workerIDs: team.workerIDs,
        patientIDs: team.patientIDs,
      });
    } else {
      createTeam({
        name: values.name,
        workerIDs: [],
        patientIDs: [],
      });
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const handleDelete = () => {
    deleteTeam(team?.id.toString() || "");
    setOpen(false);
  };

  const inputClasses = "bg-white";

  const texts = {
    title: "Breyta teymi",
    description: "Breyttu starfsmennum í starfsmennasafnið",
    button: "Vista",
    deleteButton: "Eyða",
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{texts.title}</DialogTitle>
          <DialogDescription>{texts.description}</DialogDescription>
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
              <div className="flex flex-row gap-2">
                <Button className="mt-6 ml-auto" type="submit">
                  Vista
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
