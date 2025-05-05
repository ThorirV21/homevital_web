import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";

const timeOptions = [
  { value: 1, label: "Vikulega" },
  { value: 2, label: "2 í viku" },
  { value: 3, label: "3 í viku" },
  { value: 4, label: "4 í viku" },
  { value: 5, label: "5 í viku" },
  { value: 6, label: "6 í viku" },
  { value: 7, label: "7 í viku" },
];

import { FormShape } from "@/components/treatments/form";

interface IntervalPickerProps {
  field: ControllerRenderProps<
    FormShape,
    | "bloodPressureInterval"
    | "weightInterval"
    | "bloodOxygenInterval"
    | "bloodSugarInterval"
    | "temperatureInterval"
    | "bloodPressure"
    | "weight"
    | "bloodOxygen"
    | "bloodSugar"
    | "temperature"
  >;
  label: string;
}

const IntervalPicker = ({ field }: IntervalPickerProps) => {
  return (
    <Select
      onValueChange={field.onChange}
      defaultValue={field.value?.toString() || ""}
    >
      <FormControl>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Veldu tíma" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {timeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
      <FormMessage />
    </Select>
  );
};

export default IntervalPicker;
