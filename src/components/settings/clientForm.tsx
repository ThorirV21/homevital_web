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
import { Client } from "@/types/clientTypes";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/teamTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientMutations } from "@/hooks/useClients";

const formSchema = z.object({
  name: z.string().min(4, "Nafn er nauðsynlegt"),
  address: z.string().min(4, "Heimili er nauðsynlegt"),
  phone: z.string().refine(
    (val) => {
      if (val.length === 0) return true;
      if (val.length !== 7) return false;
      return /^\d+$/.test(val);
    },
    {
      message: "Símanúmer þarf að vera 7 tölustafir",
    }
  ),
  team: z.string().min(1, "Veldu teymi"),
  ssn: z.string().length(10, "Kennitala verður að vera 10 stafir"),
});

type FormShape = z.infer<typeof formSchema>;

interface ClientFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  client: Client | null;
}

const inputClasses = "bg-background";

const ClientForm = ({ open, setOpen, client }: ClientFormProps) => {
  const { teams } = useTeams();
  const { updateMutation, deleteMutation, createMutation } =
    useClientMutations();
  const form = useForm<FormShape>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      team: "",
      ssn: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: client?.name || "",
      address: client?.address || "",
      phone: client?.phone || "",
      team: teams.find((team: Team) => team.id === client?.teamID)?.name || "",
      ssn: client?.ssn || "",
    });
  }, [client, form, teams]);

  const onSubmit = (values: FormShape) => {
    console.log(values);
    if (client) {
      updateMutation.mutate({
        id: client.id,
        name: values.name,
        address: values.address,
        phone: values.phone,
        teamID: teams.find((team: Team) => team.name === values.team)?.id,
        ssn: values.ssn,
        status: "",
      });
    } else {
      createMutation.mutate({
        id: 0,
        name: values.name,
        address: values.address,
        phone: values.phone,
        teamID: teams.find((team: Team) => team.name === values.team)?.id,
        ssn: values.ssn,
        status: "",
      });
    }
    form.reset();
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const handleDelete = () => {
    deleteMutation.mutate(client?.id.toString() || "");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Breyta skjólstæðing</DialogTitle>
          <DialogDescription>
            Breyttu upplýsingum og vistaðu breytingar.
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heimili</FormLabel>
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
                    <FormLabel>Sími</FormLabel>
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
                  <FormItem className="flex flex-col gap-2 mt-2">
                    <FormLabel>Teymi</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Veldu teymi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background">
                        {teams.map((team: Team) => (
                          <SelectItem key={team.id} value={team.name}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default ClientForm;
