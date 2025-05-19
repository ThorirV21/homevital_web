import { format } from "date-fns";
import { is } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { FormShape } from "../treatments/form";

interface DatePickerProps {
  field: ControllerRenderProps<FormShape, "startDate" | "endDate">;
  label: string;
}

const DatePicker = ({ field, label }: DatePickerProps) => {
  return (
    <FormItem className="flex flex-col pt-4">
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "overflow-hidden pl-3 text-left font-normal bg-background",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                format(field.value, "PPP", { locale: is })
              ) : (
                <span></span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={is}
            selected={field.value}
            onSelect={field.onChange}
            disabled={(date) =>
              date < new Date(new Date().setDate(new Date().getDate() - 1))
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <FormDescription></FormDescription>
      <FormMessage />
    </FormItem>
  );
};

export default DatePicker;
