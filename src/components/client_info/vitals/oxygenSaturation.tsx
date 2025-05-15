import { OxygenSaturationRange } from "@/types/vitals";

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

const parsePercentage = (value: string): number => {
  const normalizedValue = value.replace(",", ".");
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : parsed;
};

const oxygenSaturationSchema = z
  .object({
    ranges: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    const good = parsePercentage(data.ranges[0]);
    const high = parsePercentage(data.ranges[2]);

    if (!(good > high)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Eðlileg súrefnismettun verður að vera hærri en Lág súrefnismettun",
        path: ["ranges"],
      });
      return false;
    }

    return true;
  });

type FormShape = z.infer<typeof oxygenSaturationSchema>;

interface OxygenSaturationProps {
  data: OxygenSaturationRange;
  clientId: string;
}

const OxygenSaturation = ({ data, clientId }: OxygenSaturationProps) => {
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<FormShape>({
    resolver: zodResolver(oxygenSaturationSchema),
    defaultValues: {
      ranges: [
        data.oxygenSaturationGood.toString(),
        "",
        data.oxygenSaturationHigh.toString(),
      ],
    },
    mode: "onChange",
  });

  const [editing, setEditing] = useState(false);
  const { updateMutation, isPending, isSuccess } = useVitalRangeMutations(
    Number(clientId)
  );

  const formErrors = form.formState.errors;

  useEffect(() => {
    if (formErrors.ranges?.message) {
      setErrorMessage(formErrors.ranges.message as string);
    }
  }, [formErrors]);

  useEffect(() => {
    if (isSuccess) {
      setEditing(false);
    }
  }, [isSuccess]);

  const oxygenSaturationValues = [
    {
      name: "Eðlileg súrefnismettun",
      value: [data.oxygenSaturationGood.toString()],
      color: "Normal",
      prefix: "> ",
    },
    {
      name: "Lækkuð súrefnismettun",
      value: [
        data.oxygenSaturationHigh.toString(),
        data.oxygenSaturationGood.toString(),
      ],
      color: "Raised",
      prefix: "",
    },
    {
      name: "Lág súrefnismettun",
      value: [data.oxygenSaturationHigh.toString()],
      color: "High",
      prefix: "< ",
    },
  ];

  const saveData = (formData: FormShape) => {
    const good = parsePercentage(formData.ranges[0]);
    const high = parsePercentage(formData.ranges[2]);

    if (good <= high) {
      setErrorMessage(
        "Eðlileg súrefnismettun verður að vera hærri en Lág súrefnismettun"
      );
      return;
    }
    setErrorMessage("");

    const vitals: VitalRangeMutation = {
      patientID: Number(clientId),
      type: "oxygenSaturation",
      data: {
        patientID: Number(clientId),
        oxygenSaturationGood: parsePercentage(formData.ranges[0]),
        oxygenSaturationHigh: parsePercentage(formData.ranges[2]),
        oxygenSaturationRaised: parsePercentage(formData.ranges[2]) + 1,
      },
    };

    updateMutation(vitals);
  };

  const displayData = (index: number) => {
    return (
      <div className="flex flex-col gap-1 pl-5">
        <p>{oxygenSaturationValues[index].name}</p>
        <div className="flex flex-row gap-1">
          {oxygenSaturationValues[index].prefix}
          {oxygenSaturationValues[index].value.join(" - ")}
          <p>%</p>
        </div>
      </div>
    );
  };

  const handleInputChange = (index: number, value: string) => {
    form.setValue(`ranges.${index}`, value);

    // Check validation manually
    const values = form.getValues().ranges;
    const good = parsePercentage(values[0]);
    const high = parsePercentage(values[2]);

    if (good <= high) {
      setErrorMessage(
        "Eðlileg súrefnismettun verður að vera hærri en Lág súrefnismettun"
      );
    } else {
      setErrorMessage("");
    }
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
              {oxygenSaturationValues.map((value, index) => (
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
                      ) : (
                        <Controller
                          name={`ranges.${index}`}
                          control={form.control}
                          render={({ field }) => (
                            <Input
                              type="text"
                              inputMode="decimal"
                              value={field.value?.toString() || ""}
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
          oxygenSaturationValues.map((value, index) => (
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

export default OxygenSaturation;
