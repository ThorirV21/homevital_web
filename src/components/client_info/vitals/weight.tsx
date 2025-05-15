import { BodyWeightRange } from "@/types/vitals";

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

// Helper function to parse weight values safely
function parseWeightValue(value: string): number {
  const normalizedValue = value.replace(",", ".");
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : parsed;
}

const bodyWeightSchema = z.object({
  ranges: z.array(
    z.string().refine(
      (val) => {
        const num = parseWeightValue(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      { message: "Gildi verður að vera tala á milli 0 og 100" }
    )
  ),
});

type FormShape = z.infer<typeof bodyWeightSchema>;

interface BodyWeightProps {
  data: BodyWeightRange;
  clientId: string;
}

const BodyWeight = ({ data, clientId }: BodyWeightProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<FormShape>({
    resolver: zodResolver(bodyWeightSchema),
    defaultValues: {
      ranges: [
        data.weightGainFluctuationPercentageGood.toString(),
        data.weightGainPercentageGoodMax.toString(),
        data.weightLossFluctuationPercentageGood.toString(),
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

  const bodyWeight = [
    {
      name: "30 daga þyngdaraukning",
      value: [data.weightGainPercentageGoodMax.toString()],
      color: "High",
      prefix: "> + ",
    },
    {
      name: "30 daga þyngdarsveifla innan",
      value: [data.weightLossFluctuationPercentageGood.toString()],
      color: "Normal",
      prefix: "",
    },
    {
      name: "30 daga þyngdartap",
      value: [data.weightLossFluctuationPercentageGood.toString()],
      color: "High",
      prefix: "> - ",
    },
  ];

  // Convert comma to dot and ensure it's a valid number
  const parseWeight = (value: string): number => {
    // Replace comma with dot for decimal
    const normalizedValue = value.replace(",", ".");
    const parsedValue = parseFloat(normalizedValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  const saveData = (formData: FormShape) => {
    console.log("Saving form data:", formData);

    // Validate each value is between 0-100
    for (const value of formData.ranges) {
      const num = parseWeightValue(value);
      if (isNaN(num) || num < 0 || num > 100) {
        setErrorMessage("Gildi verður að vera tala á milli 0 og 100");
        return;
      }
    }

    // Clear error and submit
    setErrorMessage("");

    const vitals: VitalRangeMutation = {
      patientID: Number(clientId),
      type: "bodyweight",
      data: {
        patientID: Number(clientId),
        weightGainFluctuationPercentageGood: parseWeight(formData.ranges[1]),
        weightGainPercentageGoodMax: parseWeight(formData.ranges[1]),
        weightLossFluctuationPercentageGood: parseWeight(formData.ranges[1]),
      },
    };

    updateMutation(vitals);
  };

  const displayData = (index: number) => {
    return (
      <div className="flex flex-col gap-1 pl-5">
        <p>{bodyWeight[index].name}</p>
        <div className="flex flex-row gap-1">
          {bodyWeight[index].prefix}
          {bodyWeight[index].value.join(" - ")}
          <p>%</p>
        </div>
      </div>
    );
  };

  const handleInputChange = (index: number, value: string) => {
    form.setValue(`ranges.${index}`, value);

    // Validate number between 0-100
    const num = parseWeightValue(value);
    if (isNaN(num) || num < 0 || num > 100) {
      setErrorMessage("Gildi verður að vera tala á milli 0 og 100");
      return;
    }

    // Clear any existing error
    setErrorMessage("");

    // Also trigger form validation
    form.trigger("ranges");
  };

  return (
    <div className="flex flex-col h-[92%] w-full">
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
              {bodyWeight.map((value, index) => (
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
                      {index === 0 || index === 2 ? (
                        <span>{value.value.join(" - ")}</span>
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
                      <p>%</p>
                    </div>
                  </div>
                </div>
              ))}
            </form>
          </div>
        ) : (
          bodyWeight.map((value, index) => (
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

export default BodyWeight;
