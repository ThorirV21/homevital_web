import { BloodSugarRange } from "@/types/vitals";

import { z } from "zod";
import Circle from "@/components/icons/circle";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useVitalRangeMutations, VitalRangeMutation } from "@/hooks/useVitals";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Helper function to parse temperature values safely
function parseBloodSugarValues(value: string): number {
  const normalizedValue = value.replace(",", ".");
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : parsed;
}

const bloodSugarSchema = z
  .object({
    ranges: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    // Parse values to numbers for comparison
    const underAverage = parseBloodSugarValues(data.ranges[0]);
    const good = parseBloodSugarValues(data.ranges[1]);
    const notOk = parseBloodSugarValues(data.ranges[2]);

    console.log("Validating values:", { underAverage, good, notOk });

    // Check if values are in ascending order
    if (!(underAverage <= good)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Undir meðallagi verður að vera lægra en Eðlilegur hiti",
        path: ["ranges"],
      });
      return false;
    }

    if (!(good <= notOk)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Eðlilegur hiti verður að vera lægri en Yfir meðallagi",
        path: ["ranges"],
      });
      return false;
    }

    return true;
  });

type FormShape = z.infer<typeof bloodSugarSchema>;

interface BloodSugarProps {
  data: BloodSugarRange;
  clientId: string;
}

const BloodSugar = ({ data, clientId }: BloodSugarProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<FormShape>({
    resolver: zodResolver(bloodSugarSchema),
    defaultValues: {
      ranges: [
        data.bloodSugarLowered.toString(),
        data.bloodSugarGood.toString(),
        data.bloodSugarRaised.toString(),
        data.bloodSugarHigh.toString(),
      ],
    },
    mode: "onChange", // Enable real-time validation
  });

  const [editing, setEditing] = useState(false);
  const { updateMutation, isPending, isSuccess } = useVitalRangeMutations(
    Number(clientId)
  );

  // Form errors
  const formErrors = form.formState.errors;

  // Log errors for debugging
  useEffect(() => {
    console.log("Form errors:", formErrors);
    // Extract error message from form errors
    if (formErrors.ranges?.message) {
      setErrorMessage(formErrors.ranges.message as string);
    }
  }, [formErrors]);

  useEffect(() => {
    if (isSuccess) {
      setEditing(false);
    }
  }, [isSuccess]);

  const bloodSugar = [
    {
      name: "Undir meðallagi",
      value: [data.bloodSugarLowered.toString()],
      color: "Raised",
      prefix: "< ",
    },
    {
      name: "Eðlilegur hiti",
      value: [
        data.bloodSugarLowered.toString(),
        data.bloodSugarGood.toString(),
      ],
      color: "Normal",
      prefix: "",
    },
    {
      name: "Yfir meðallagi",
      value: [data.bloodSugarGood.toString(), data.bloodSugarRaised.toString()],
      color: "Raised",
      prefix: " ",
    },
    {
      name: "Hiti",
      value: [data.bloodSugarRaised.toString()],
      color: "High",
      prefix: "> ",
    },
  ];

  // Convert comma to dot and ensure it's a valid number
  const parseBloodSugar = (value: string): number => {
    // Replace comma with dot for decimal
    const normalizedValue = value.replace(",", ".");
    const parsedValue = parseFloat(normalizedValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  const saveData = (formData: FormShape) => {
    console.log("Saving form data:", formData);
    // Final validation check
    const underAverage = parseBloodSugarValues(formData.ranges[0]);
    const good = parseBloodSugarValues(formData.ranges[1]);
    const notOk = parseBloodSugarValues(formData.ranges[2]);

    if (underAverage >= good) {
      setErrorMessage("Undir meðallagi verður að vera lægra en Eðlilegur hiti");
      return;
    }

    if (good >= notOk) {
      setErrorMessage("Eðlilegur hiti verður að vera lægri en Yfir meðallagi");
      return;
    }

    // Clear error and submit
    setErrorMessage("");

    const vitals: VitalRangeMutation = {
      patientID: Number(clientId),
      type: "bloodsugar",
      data: {
        patientID: Number(clientId),
        bloodSugarLowered: parseBloodSugar(formData.ranges[0]),
        bloodSugarGood: parseBloodSugar(formData.ranges[1]),
        bloodSugarRaised: parseBloodSugar(formData.ranges[2]),
        bloodSugarHigh: parseBloodSugar(formData.ranges[2]) + 1,
      },
    };

    updateMutation(vitals);
  };

  const displayData = (index: number) => {
    return (
      <div className="flex flex-col gap-1 pl-5">
        <p>{bloodSugar[index].name}</p>
        <div className="flex flex-row gap-1">
          {bloodSugar[index].prefix}
          {bloodSugar[index].value.join(" - ")}
          <p>mmól/L</p>
        </div>
      </div>
    );
  };

  const handleInputChange = (index: number, value: string) => {
    form.setValue(`ranges.${index}`, value);

    // Check validation manually
    const values = form.getValues().ranges;
    const underAverage = parseBloodSugarValues(values[0]);
    const good = parseBloodSugarValues(values[1]);
    const notOk = parseBloodSugarValues(values[2]);

    if (underAverage >= good) {
      setErrorMessage("Undir meðallagi verður að vera lægra en Eðlilegur hiti");
    } else if (good >= notOk) {
      setErrorMessage("Eðlilegur hiti verður að vera lægri en Yfir meðallagi");
    } else {
      setErrorMessage("");
    }

    // Also trigger form validation
    form.trigger("ranges");
  };

  return (
    <div className="flex flex-col h-[92%] w-full border-primary border-2">
      <div className="flex flex-row p-6 items-center w-full">
        {editing ? (
          <div className="flex gap-2 items-center pl-14 ">
            <Button
              size="lg"
              className="text-lg"
              onClick={() => form.handleSubmit(saveData)()}
              disabled={!!errorMessage}
            >
              {isPending ? <Loader2 className="animate-spin" /> : "Vista"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="text-lg"
              onClick={() => setEditing(false)}
            >
              Hætta við
            </Button>
          </div>
        ) : (
          <></>
        )}
        <Button
          className="relative w-10 h-10 px-0 py-0 bg-transparent border-none shadow-none ml-auto"
          onClick={() => setEditing(!editing)}
        >
          <Pen className="!h-full !w-full text-primary" />
        </Button>
      </div>

      {editing && errorMessage && (
        <div className="text-destructive pl-10">{errorMessage}</div>
      )}

      <div className="flex flex-col gap-2 pb-20">
        {editing ? (
          <div className="w-full">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(saveData)();
              }}
            >
              {bloodSugar.map((value, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-2 items-center pl-8 py-2"
                >
                  <Circle
                    className={`h-14 w-14 flex-shrink-0 ${value.color}`}
                  />
                  <div className="flex flex-col gap-1 pl-5">
                    <p>{value.name}</p>
                    <div className="flex flex-row gap-1 items-center">
                      {value.prefix}
                      {index === 1 ? (
                        <span>{value.value.join(" - ")}</span>
                      ) : index === 2 ? (
                        <>
                          <Controller
                            name={`ranges.${1}`}
                            control={form.control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                inputMode="decimal"
                                value={field.value || ""}
                                onChange={(e) =>
                                  handleInputChange(1, e.target.value)
                                }
                                className="w-20"
                              />
                            )}
                          />
                          <p> - </p>
                          <p>{value.value[1]}</p>
                        </>
                      ) : index === 3 ? (
                        <Controller
                          name={`ranges.${2}`}
                          control={form.control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={field.value || ""}
                              onChange={(e) =>
                                handleInputChange(2, e.target.value)
                              }
                              className="w-20"
                            />
                          )}
                        />
                      ) : (
                        <Controller
                          name={`ranges.${index}`}
                          control={form.control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={field.value || ""}
                              onChange={(e) =>
                                handleInputChange(index, e.target.value)
                              }
                              className="w-20"
                            />
                          )}
                        />
                      )}
                      <p>mmól/L</p>
                    </div>
                  </div>
                </div>
              ))}
            </form>
          </div>
        ) : (
          bloodSugar.map((value, index) => (
            <div
              key={index}
              className="flex flex-row gap-2 items-center pl-8 py-2"
            >
              <Circle className={`h-14 w-14 flex-shrink-0 ${value.color}`} />
              {displayData(index)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BloodSugar;
