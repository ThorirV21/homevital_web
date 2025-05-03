import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/forms/datePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const knownForms = [
  {
    id: 1,
    name: "Grunnáætlun",
  },
  {
    id: 2,
    name: "Súrefnismettun",
  },
  {
    id: 3,
    name: "Blóðsykur",
  },
  {
    id: 4,
    name: "Hiti",
  },
];

import IntervalPicker from "@/components/forms/intervalPicker";
import { useTeams } from "@/hooks/useTeams";
import { Team } from "@/types/teamTypes";
import { Button } from "../ui/button";
import { useTreatmentMutations } from "@/hooks/useTreatments";
import { selectDays } from "@/services/treatmentPlan";
const formSchema = z.object({
  name: z.string().min(1, "Nafn áætlunar er nauðsynlegt"),
  startDate: z.date({
    required_error: "Upphafs dagsetning er nauðsynlegt",
  }),
  endDate: z.date().optional(),
  bloodPressure: z.boolean().optional(),
  weight: z.boolean().optional(),
  bloodOxygen: z.boolean().optional(),
  bloodSugar: z.boolean().optional(),
  temperature: z.boolean().optional(),
  bloodPressureInterval: z.string().optional(),
  weightInterval: z.string().optional(),
  bloodOxygenInterval: z.string().optional(),
  bloodSugarInterval: z.string().optional(),
  temperatureInterval: z.string().optional(),
  notes: z.string().optional(),
  knownForm: z.number().optional(),
  team: z.string(),
});

export type FormShape = z.infer<typeof formSchema>;

const TreatmentForm = ({ id }: { id: string }) => {
  const { createMutation } = useTreatmentMutations();
  const { teams, teamsLoading, teamsError } = useTeams();
  const form = useForm<FormShape>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  if (teamsLoading) {
    return <div>Loading...</div>;
  }

  if (teamsError) {
    return <div>Error: {teamsError.message}</div>;
  }

  const onSubmit = (values: FormShape) => {
    createMutation.mutate({
      name: values.name,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate?.toISOString() || "",
      patientID: Number(id),
      instructions: values.notes || "",
      teamID: teams.find((team: Team) => team.name === values.team)?.id || 0,
      weightMeasurementDays: selectDays(Number(values.weightInterval)),
      bloodSugarMeasurementDays: selectDays(Number(values.bloodSugarInterval)),
      bloodPressureMeasurementDays: selectDays(
        Number(values.bloodPressureInterval)
      ),
      oxygenSaturationMeasurementDays: selectDays(
        Number(values.bloodOxygenInterval)
      ),
      bodyTemperatureMeasurementDays: selectDays(
        Number(values.temperatureInterval)
      ),
    });
  };

  const inputClasses = "";
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-1 flex flex-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nafn áætlunar*</FormLabel>
                  <FormControl>
                    <Input className={inputClasses} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2">
              <div className="col-1">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <DatePicker field={field} label="Upphafs dags" />
                  )}
                />
              </div>
              <div className="col-2">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <DatePicker field={field} label="Endir" />
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="col-1 flex flex-col gap-auto h-full justify-center">
                <FormField
                  control={form.control}
                  name="bloodPressure"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="ml-2">Blóðþrýstingur</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-2">
                <FormField
                  control={form.control}
                  name="bloodPressureInterval"
                  render={({ field }) => (
                    <FormItem>
                      <IntervalPicker field={field} label="Tími" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="col-1 flex flex-col gap-auto h-full justify-center">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="ml-2">Þyngd</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-2">
                <FormField
                  control={form.control}
                  name="weightInterval"
                  render={({ field }) => (
                    <FormItem>
                      <IntervalPicker field={field} label="Tími" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="col-1 flex flex-col gap-auto h-full justify-center">
                <FormField
                  control={form.control}
                  name="bloodOxygen"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="ml-2">Súrefnismettun</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-2">
                <FormField
                  control={form.control}
                  name="bloodOxygenInterval"
                  render={({ field }) => (
                    <FormItem>
                      <IntervalPicker field={field} label="Tími" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="col-1 flex flex-col gap-auto h-full justify-center">
                <FormField
                  control={form.control}
                  name="bloodSugar"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="ml-2">Blóðsykur</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-2">
                <FormField
                  control={form.control}
                  name="bloodSugarInterval"
                  render={({ field }) => (
                    <FormItem>
                      <IntervalPicker field={field} label="Tími" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="col-1 flex flex-col gap-auto h-full justify-center">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="ml-2">Hiti</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-2">
                <FormField
                  control={form.control}
                  name="temperatureInterval"
                  render={({ field }) => (
                    <FormItem>
                      <IntervalPicker field={field} label="Tími" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="pt-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leiðbeiningar</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="h-24" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="col-2 flex flex-col">
            <FormField
              control={form.control}
              name="knownForm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Velja þekkt form</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Velja þekkt form" />
                      </SelectTrigger>
                      <SelectContent>
                        {knownForms.map((form) => (
                          <SelectItem key={form.id} value={form.id.toString()}>
                            {form.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Velja teymi</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Velja teymi" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team: Team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>
                            {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-auto ml-auto flex gap-2">
              <Button className="bg-background" variant="outline" type="button">
                Hætta við
              </Button>
              <Button type="submit">Vista</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TreatmentForm;
