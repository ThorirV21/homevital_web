import { BloodPressureRange } from "@/types/vitals";

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
function parseBloodPressureValues(value: string): number {
  const normalizedValue = value.replace(",", ".");
  const parsed = parseInt(normalizedValue);
  return isNaN(parsed) ? 0 : parsed;
}

const bloodPressureSchema = z
  .object({
    systolic: z.array(z.string()),
    diastolic: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    // Parse values to numbers for comparison
    const systolicUnderAverage = parseBloodPressureValues(data.systolic[0]);
    const systolicNotOk = parseBloodPressureValues(data.systolic[1]);
    const systolicHigh = parseBloodPressureValues(data.systolic[2]);

    // Check if values are in ascending order
    if (!(systolicUnderAverage <= systolicNotOk)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Lágþrýstingur verður að vera lægri en hækkaður blóðþrýstingur",
        path: ["systolic"],
      });
      return false;
    }

    if (!(systolicNotOk <= systolicHigh)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hækkaður blóðþrýstingur verður að vera lægri en Háþrýstingur",
        path: ["systolic"],
      });
      return false;
    }

    const diastolicUnderAverage = parseBloodPressureValues(data.diastolic[0]);
    const diastolicNotOk = parseBloodPressureValues(data.diastolic[1]);
    const diastolicHigh = parseBloodPressureValues(data.diastolic[2]);

    if (!(diastolicUnderAverage <= diastolicNotOk)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Lágþrýstingur verður að vera lægri en Hækkaður blóðþrýstingur",
        path: ["diastolic"],
      });
      return false;
    }

    if (!(diastolicNotOk <= diastolicHigh)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hækkaður blóðþrýstingur verður að vera lægri en Háþrýstingur",
        path: ["diastolic"],
      });
      return false;
    }

    return true;
  });

type FormShape = z.infer<typeof bloodPressureSchema>;

interface BloodPressureProps {
  data: BloodPressureRange;
  clientId: string;
}

const BloodPressure = ({ data, clientId }: BloodPressureProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<FormShape>({
    resolver: zodResolver(bloodPressureSchema),
    defaultValues: {
      systolic: [
        data.systolicLowered.toString(),
        data.systolicGood.toString(),
        data.systolicRaised.toString(),
        data.systolicHigh.toString(),
      ],
      diastolic: [
        data.diastolicLowered.toString(),
        data.diastolicGood.toString(),
        data.diastolicRaised.toString(),
        data.diastolicHigh.toString(),
      ],
    },
    mode: "onChange", // Enable real-time validation
  });

  const [editing, setEditing] = useState(true);
  const { updateMutation, isPending, isSuccess } = useVitalRangeMutations(
    Number(clientId)
  );

  // Form errors
  const formErrors = form.formState.errors;

  // Log errors for debugging
  useEffect(() => {
    console.log("Form errors:", formErrors);
    // Extract error message from form errors
    if (formErrors.systolic?.message) {
      setErrorMessage(formErrors.systolic.message as string);
    }
  }, [formErrors]);

  useEffect(() => {
    if (isSuccess) {
      setEditing(false);
    }
  }, [isSuccess]);

  const bloodPressure = [
    {
      name: "Lágþrýstingur",
      systolic: [data.systolicLowered.toString()],
      diastolic: [data.diastolicLowered.toString()],
      color: "Raised",
      prefix: "< ",
    },
    {
      name: "Eðlilegur blóðþrýstingur",
      systolic: [data.systolicLowered.toString(), data.systolicGood.toString()],
      diastolic: [
        data.diastolicLowered.toString(),
        data.diastolicGood.toString(),
      ],
      color: "Normal",
      prefix: "",
    },
    {
      name: "Hækkaður blóðþrýstingur",
      systolic: [data.systolicGood.toString(), data.systolicRaised.toString()],
      diastolic: [
        data.diastolicGood.toString(),
        data.diastolicRaised.toString(),
      ],
      color: "Raised",
      prefix: "> ",
    },
    {
      name: "Háþrýstingur",
      systolic: [data.systolicRaised.toString()],
      diastolic: [data.diastolicRaised.toString()],
      color: "High",
      prefix: "> ",
    },
  ];

  const checkValidity = (formData: FormShape) => {
    const systolicUnderAverage = parseBloodPressureValues(formData.systolic[0]);
    const systolicNotOk = parseBloodPressureValues(formData.systolic[1]);
    const systolicHigh = parseBloodPressureValues(formData.systolic[2]);

    console.log(systolicUnderAverage, "<", systolicNotOk, "<", systolicHigh);

    if (!(systolicUnderAverage <= systolicNotOk)) {
      setErrorMessage(
        "Lágþrýstingur verður að vera lægri en hækkaður blóðþrýstingur"
      );
      return false;
    }

    if (!(systolicNotOk <= systolicHigh)) {
      setErrorMessage(
        "Hækkaður blóðþrýstingur verður að vera lægri en Háþrýstingur"
      );
      return false;
    }

    const diastolicUnderAverage = parseBloodPressureValues(
      formData.diastolic[0]
    );
    const diastolicNotOk = parseBloodPressureValues(formData.diastolic[1]);
    const diastolicHigh = parseBloodPressureValues(formData.diastolic[2]);

    console.log(diastolicUnderAverage, "<", diastolicNotOk, "<", diastolicHigh);

    if (!(diastolicUnderAverage <= diastolicNotOk)) {
      setErrorMessage(
        "Lágþrýstingur verður að vera lægri en Hækkaður blóðþrýstingur"
      );
      return false;
    }

    if (!(diastolicNotOk <= diastolicHigh)) {
      setErrorMessage(
        "Hækkaður blóðþrýstingur verður að vera lægri en Háþrýstingur"
      );
      return false;
    }

    return true;
  };

  // Convert comma to dot and ensure it's a valid number
  const parseBloodPressure = (value: string): number => {
    // Replace comma with dot for decimal
    const normalizedValue = value.replace(",", ".");
    const parsedValue = parseInt(normalizedValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  const saveData = (formData: FormShape) => {
    const isValid = checkValidity(formData);
    if (!isValid) {
      return;
    }

    const vitals: VitalRangeMutation = {
      patientID: Number(clientId),
      type: "bloodpressure",
      data: {
        patientID: Number(clientId),
        systoliclowered: parseBloodPressure(formData.systolic[0]),
        systolicgood: parseBloodPressure(formData.systolic[1]),
        systolicraised: parseBloodPressure(formData.systolic[2]),
        systolichigh: parseBloodPressure(formData.systolic[3]) + 1,
        diastoliclowered: parseBloodPressure(formData.diastolic[0]),
        diastolicgood: parseBloodPressure(formData.diastolic[1]),
        diastolicraised: parseBloodPressure(formData.diastolic[2]),
        diastolichigh: parseBloodPressure(formData.diastolic[3]) + 1,
      },
    };

    updateMutation(vitals);
  };

  const displayData = (index: number) => {
    return (
      <div className="flex flex-col gap-1 pl-5">
        <p>{bloodPressure[index].name}</p>
        <div className="flex flex-row gap-1">
          {bloodPressure[index].prefix}
          {bloodPressure[index].systolic.join(" - ")}
          <p> / </p>
          {bloodPressure[index].prefix}
          {bloodPressure[index].diastolic.join(" - ")}
        </div>
      </div>
    );
  };

  const handleSystolicChange = (index: number, value: string) => {
    console.log(index, value);
    form.setValue(`systolic.${index}`, value);
    validateForm();
  };

  const handleDiastolicChange = (index: number, value: string) => {
    console.log(index, value);
    form.setValue(`diastolic.${index}`, value);
    validateForm();
  };

  const validateForm = () => {
    // Get current values
    const values = form.getValues();

    // Validate systolic values
    const systolicUnderAverage = parseBloodPressureValues(values.systolic[0]);
    const systolicRaised = parseBloodPressureValues(values.systolic[1]);
    const systolicHigh = parseBloodPressureValues(values.systolic[2]);

    if (!(systolicUnderAverage <= systolicRaised)) {
      setErrorMessage(
        "Lágþrýstingur verður að vera lægri en hækkaður blóðþrýstingur"
      );
      return;
    }

    if (!(systolicRaised <= systolicHigh)) {
      setErrorMessage(
        "Hækkaður blóðþrýstingur verður að vera lægri en Háþrýstingur"
      );
      return;
    }

    // Validate diastolic values
    const diastolicUnderAverage = parseBloodPressureValues(values.diastolic[0]);
    const diastolicNotOk = parseBloodPressureValues(values.diastolic[1]);
    const diastolicHigh = parseBloodPressureValues(values.diastolic[2]);

    console.log(diastolicUnderAverage, "<", diastolicNotOk, "<", diastolicHigh);

    if (!(diastolicUnderAverage <= diastolicNotOk)) {
      setErrorMessage(
        "Lágþrýstingur verður að vera lægri en Hækkaður blóðþrýstingur"
      );
      return;
    }

    if (!(diastolicNotOk <= diastolicHigh)) {
      setErrorMessage(
        "Hækkaður blóðþrýstingur verður að vera lægri en Háþrýstingur"
      );
      return;
    }

    // If we get here, everything is valid
    setErrorMessage("");

    // Also trigger form validation
    form.trigger("systolic");
    form.trigger("diastolic");
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
              {bloodPressure.map((value, index) => (
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
                        <span>
                          {value.systolic.join(" - ")} /{" "}
                          {value.diastolic.join(" - ")}
                        </span>
                      ) : index === 2 ? (
                        <>
                          <Controller
                            name={`systolic.${1}`}
                            control={form.control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                inputMode="decimal"
                                value={field.value || ""}
                                onChange={(e) =>
                                  handleSystolicChange(1, e.target.value)
                                }
                                className="w-20"
                              />
                            )}
                          />
                          <p> - </p>
                          <p>{value.systolic[1]}</p>
                          <p className="text-xl px-2"> / </p>
                          {value.prefix}
                          <Controller
                            name={`diastolic.${1}`}
                            control={form.control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                inputMode="decimal"
                                value={field.value || ""}
                                onChange={(e) =>
                                  handleDiastolicChange(1, e.target.value)
                                }
                                className="w-20"
                              />
                            )}
                          />
                          <p> - </p>
                          <p>{value.diastolic[1]}</p>
                        </>
                      ) : index === 3 ? (
                        <>
                          <Controller
                            name={`systolic.${2}`}
                            control={form.control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                inputMode="decimal"
                                value={field.value || ""}
                                onChange={(e) =>
                                  handleSystolicChange(2, e.target.value)
                                }
                                className="w-20"
                              />
                            )}
                          />
                          <p className="text-xl px-2"> / </p>
                          {value.prefix}
                          <Controller
                            name={`diastolic.${2}`}
                            control={form.control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                inputMode="decimal"
                                value={field.value || ""}
                                onChange={(e) =>
                                  handleDiastolicChange(2, e.target.value)
                                }
                                className="w-20"
                              />
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <Controller
                            name={`systolic.${index}`}
                            control={form.control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                inputMode="decimal"
                                value={field.value || ""}
                                onChange={(e) =>
                                  handleSystolicChange(index, e.target.value)
                                }
                                className="w-20"
                              />
                            )}
                          />
                          <p className="text-xl px-2"> / </p>
                          {value.prefix}
                          <Controller
                            name={`diastolic.${index}`}
                            control={form.control}
                            render={({ field }) => (
                              <Input
                                type="text"
                                inputMode="decimal"
                                value={field.value || ""}
                                onChange={(e) =>
                                  handleDiastolicChange(index, e.target.value)
                                }
                                className="w-20"
                              />
                            )}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </form>
          </div>
        ) : (
          bloodPressure.map((value, index) => (
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

export default BloodPressure;
