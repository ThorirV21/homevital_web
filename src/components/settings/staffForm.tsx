import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { staffSchema } from "@/services/schemas";
import { WorkerDTO } from "@/types/types";
import { FormInput } from "../forms/input";
import { MultiSelect } from "../forms/multiSelect";

const StaffForm = ({ user }: { user: WorkerDTO }) => {
  const [selected, setSelected] = useState<string[]>([user.status]);
  const form = useForm<z.infer<typeof staffSchema>>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      team: user.teamID,
      status: user.status,
    },
  });

  const onSubmit = (data: z.infer<typeof staffSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormInput {...field} label="Nafn" description="Nafn" type="name" />
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormInput {...field} label="Sími" description="Sími" type="tel" />
          )}
        />
        <FormField
          control={form.control}
          name="team"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teymi:</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>Teymi</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <MultiSelect
              {...field}
              options={["active", "inactive"]}
              selected={selected}
              onChange={(value) => {
                setSelected(value);
                field.onChange(value[0]);
              }}
              label="Staða"
              description="Staða"
            />
          )}
        />

        <Button type="submit">Vista</Button>
      </form>
    </Form>
  );
};

export default StaffForm;
