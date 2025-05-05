import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/teamTypes";
import { WorkerDTO } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MultiSelect } from "../forms/multiSelect";
import { useHealthcareWorkerMutations } from "@/hooks/useWorkers";

const formSchema = z.object({
  name: z.string().min(1, "Nafn er nauðsynlegt"),
  phone: z.string().min(1, "Símanúmer er nauðsynlegt"),
  team: z.array(z.string()).min(1, "Teymi er nauðsynlegt"),
  status: z.string().min(1, "Staða er nauðsynlegt"),
  ssn: z.string().length(10, "Kennitala verður að vera 10 stafir"),
});

type FormShape = z.infer<typeof formSchema>;

interface StaffFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  staff: WorkerDTO | null;
}

const StaffForm = ({ open, setOpen, staff }: StaffFormProps) => {
  const { teams } = useTeams();
  const { updateMutation, deleteMutation, createMutation } =
    useHealthcareWorkerMutations();
  const form = useForm<FormShape>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      team: [],
      status: "",
      ssn: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: staff?.name || "",
      phone: staff?.phone || "",
      team: teams
        ?.filter((team: Team) => staff?.teamIDs.includes(team.id))
        .map((team: Team) => team.name),
      status: staff?.status || "",
      ssn: staff?.ssn || "",
    });
  }, [staff, form, teams]);

  const onSubmit = (values: FormShape) => {
    if (staff) {
      updateMutation.mutate({
        id: staff?.id || 0,
        name: values.name,
        phone: values.phone,
        teamIDs: values.team.map(
          (team: string) => teams?.find((t: Team) => t.name === team)?.id || 0
        ),
        status: values.status,
        ssn: values.ssn,
      });
    } else {
      createMutation.mutate({
        id: 0,
        name: values.name,
        phone: values.phone,
        teamIDs: values.team.map(
          (team: string) => teams?.find((t: Team) => t.name === team)?.id || 0
        ),
        status: values.status,
        ssn: values.ssn,
      });
    }
    form.reset();
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate(staff?.id.toString() || "");
    setOpen(false);
  };

  const inputClasses = "bg-background";
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Starfsmaður</DialogTitle>
          <DialogDescription>
            Settu inn upplýsingar starfsmannsins og vistaðu.
          </DialogDescription>
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
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kennitala</FormLabel>
                    <FormControl>
                      <Input className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Símanúmer</FormLabel>
                    <FormControl>
                      <Input className={inputClasses} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teymi</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={teams?.map((team: Team) => team.name) || []}
                        selected={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-row gap-2">
                <Button
                  className="mt-6 ml-auto"
                  type="button"
                  onClick={() => onSubmit(form.getValues())}
                >
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

export default StaffForm;
