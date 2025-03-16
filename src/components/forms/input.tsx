import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

const FormInput = ({ ...props }) => {
  return (
    <FormItem>
      <FormLabel>{props.label}</FormLabel>
      <FormControl>
        <Input {...props} />
      </FormControl>
      <FormDescription>{props.description}</FormDescription>
      <FormMessage />
    </FormItem>
  );
};

export { FormInput };
