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
import { useForm, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/forms/datePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

import IntervalPicker from "@/components/forms/intervalPicker";
import { useTeams } from "@/hooks/useTeams";
import { useClientDetails } from "@/hooks/useClients";
import { Team } from "@/types/teamTypes";
import { Button } from "../ui/button";
import { useTreatmentMutations } from "@/hooks/useTreatments";
import { selectDays } from "@/services/treatmentPlan";
import { TreatmentPost } from "@/types/treatmentTypes";
import { useCallback, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

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

export type TreatmentFormProps = {
  id: string;
  setCreateNew: (createNew: boolean) => void;
};

const TreatmentForm = ({ id, setCreateNew }: TreatmentFormProps) => {
  const { createMutation, isCreating, isCreated } = useTreatmentMutations(id);
  const { teams, teamsLoading, teamsError } = useTeams();
  const { patientDetails } = useClientDetails(id);
  const form = useForm<FormShape>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: undefined,
      endDate: undefined,
      bloodPressure: false,
      weight: false,
      bloodOxygen: false,
      bloodSugar: false,
      temperature: false,
      bloodPressureInterval: "",
      weightInterval: "",
      bloodOxygenInterval: "",
      bloodSugarInterval: "",
      temperatureInterval: "",
    },
  });

  const bloodPressureWatch = useWatch({
    control: form.control,
    name: "bloodPressure",
  });

  const weightWatch = useWatch({
    control: form.control,
    name: "weight",
  });

  const bloodOxygenWatch = useWatch({
    control: form.control,
    name: "bloodOxygen",
  });

  const bloodSugarWatch = useWatch({
    control: form.control,
    name: "bloodSugar",
  });

  const temperatureWatch = useWatch({
    control: form.control,
    name: "temperature",
  });

  const bloodPressureIntervalWatch = useWatch({
    control: form.control,
    name: "bloodPressureInterval",
  });

  const weightIntervalWatch = useWatch({
    control: form.control,
    name: "weightInterval",
  });

  const bloodOxygenIntervalWatch = useWatch({
    control: form.control,
    name: "bloodOxygenInterval",
  });

  const bloodSugarIntervalWatch = useWatch({
    control: form.control,
    name: "bloodSugarInterval",
  });

  const temperatureIntervalWatch = useWatch({
    control: form.control,
    name: "temperatureInterval",
  });

  const setValue = useCallback(
    (
      name: keyof FormShape,
      value: string | number | boolean,
      options: { [key: string]: boolean }
    ) => form.setValue(name, value, options),
    [form]
  );

  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      return;
    }

    if (bloodPressureWatch && !bloodPressureIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("bloodPressureInterval", "1", { shouldValidate: false });
    }

    if (!bloodPressureWatch && bloodPressureIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("bloodPressureInterval", "", { shouldValidate: false });
    }

    if (weightWatch && !weightIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("weightInterval", "1", { shouldValidate: false });
    }

    if (!weightWatch && weightIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("weightInterval", "", { shouldValidate: false });
    }

    if (bloodOxygenWatch && !bloodOxygenIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("bloodOxygenInterval", "1", { shouldValidate: false });
    }

    if (!bloodOxygenWatch && bloodOxygenIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("bloodOxygenInterval", "", { shouldValidate: false });
    }

    if (bloodSugarWatch && !bloodSugarIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("bloodSugarInterval", "1", { shouldValidate: false });
    }

    if (!bloodSugarWatch && bloodSugarIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("bloodSugarInterval", "", { shouldValidate: false });
    }

    if (temperatureWatch && !temperatureIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("temperatureInterval", "1", { shouldValidate: false });
    }

    if (!temperatureWatch && temperatureIntervalWatch) {
      isUpdatingRef.current = true;
      setValue("temperatureInterval", "", { shouldValidate: false });
    }
  }, [
    bloodPressureWatch,
    bloodPressureIntervalWatch,
    weightWatch,
    weightIntervalWatch,
    bloodOxygenWatch,
    bloodOxygenIntervalWatch,
    bloodSugarWatch,
    bloodSugarIntervalWatch,
    temperatureWatch,
    temperatureIntervalWatch,
    setValue,
  ]);

  useEffect(() => {
    if (isCreated) {
      setCreateNew(false);
    }
  }, [isCreated, setCreateNew]);

  if (teamsLoading) {
    return <div>Loading...</div>;
  }

  if (teamsError) {
    return <div>Error: {teamsError.message}</div>;
  }

  const onSubmit = (values: FormShape) => {
    const plan: TreatmentPost = {
      name: values.name,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate?.toISOString() || "",
      patientID: Number(id),
      instructions: values.notes || "",
      teamID: patientDetails?.teamID || 0,
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
    };

    createMutation(plan);
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
                      <IntervalPicker
                        field={field}
                        label="Tími"
                        disabled={!bloodPressureWatch}
                      />
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
                      <IntervalPicker
                        field={field}
                        label="Tími"
                        disabled={!weightWatch}
                      />
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
                      <IntervalPicker
                        field={field}
                        label="Tími"
                        disabled={!bloodOxygenWatch}
                      />
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
                      <IntervalPicker
                        field={field}
                        label="Tími"
                        disabled={!bloodSugarWatch}
                      />
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
                      <IntervalPicker
                        field={field}
                        label="Tími"
                        disabled={!temperatureWatch}
                      />
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
            <div className="pt-4">
              <h3 className="text-sm">Teymi</h3>
              <p className="text-md text-muted-foreground ps-2 pt-2">
                {
                  teams?.find(
                    (team: Team) => team.id === patientDetails?.teamID
                  )?.name
                }
              </p>
            </div>
            <div className="mt-auto ml-auto flex gap-2">
              <Button
                className="bg-background"
                variant="outline"
                type="button"
                onClick={() => setCreateNew(false)}
              >
                Hætta við
              </Button>
              <Button type="submit" onClick={() => onSubmit(form.getValues())}>
                {isCreating ? <Loader2 className="animate-spin" /> : "Vista"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TreatmentForm;
