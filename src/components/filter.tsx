import { Checkbox } from "@/components/ui/checkbox";
import { filterProps } from "./clients/ClientList";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const items = [
  {
    id: "utan-marka",
    name: "Utan marka",
  },
  {
    id: "rett-utan-marka",
    name: "Rétt utan marka",
  },
  {
    id: "skraningar-i-sogu",
    name: "Skráningar í sögu",
  },
  {
    id: "aatlun-lokid",
    name: "Áætlun lokið",
  },
  {
    id: "min-teymi",
    name: "Mín teymi",
  },
  {
    id: "allt",
    name: "Allar tegundir",
  },
] as const;

const FormSchema = z.object({
  items: z.array(z.string()).default([]),
});

const Filter = ({
  filters,
  setFilters,
  setPopoverOpen,
}: {
  filters: filterProps;
  setFilters: (filters: filterProps) => void;
  setPopoverOpen: (open: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [...filters.status, filters.teamId ? "min-teymi" : ""],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    setFilters({
      status: data.items,
      teamId: data.items.includes("min-teymi"),
    });
    setPopoverOpen(false);
  };

  const handleCheckedChange = (
    checked: boolean,
    itemId: string,
    field: ControllerRenderProps<z.infer<typeof FormSchema>, "items">
  ) => {
    if (itemId === "allt") {
      if (checked) {
        field.onChange(items.map((item) => item.id));
      } else {
        field.onChange([]);
      }
    } else {
      const newValue = checked
        ? [...field.value, itemId]
        : field.value.filter((value: string) => value !== itemId);
      if (newValue.length === items.length - 1 && !newValue.includes("allt")) {
        newValue.push("allt");
      } else if (newValue.includes("allt") && newValue.length < items.length) {
        newValue.splice(newValue.indexOf("allt"), 1);
      }

      field.onChange(newValue);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Sía
                </FormLabel>
                <FormDescription className="text-sm text-gray-500">
                  Hakaðu í þær tegundir af viðvörunum sem þú vilt skoð. Veldu
                  allar tegundir til að sjá allt.
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex items-center gap-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={Boolean(field.value?.includes(item.id))}
                            onCheckedChange={(checked: boolean) => {
                              handleCheckedChange(checked, item.id, field);
                            }}
                          />
                        </FormControl>
                        <FormLabel>{item.name}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </FormItem>
          )}
        />
        <Button className="mt-10 justify-end" type="submit">
          Velja
        </Button>
      </form>
    </Form>
  );
};

/*   const [selectAll, setSelectAll] = useState(false);

  const handleStatusCheckboxChange = (value: string) => {
    console.log(value);
    const newFilters: filterProps = {
      ...filters,
      status: filters.status.includes(value)
        ? filters.status.filter((item) => item !== value)
        : [...filters.status, value],
    };

    setFilters(newFilters);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setFilters({ status: [], teamId: false });
    } else {
      setFilters({ status: [...FILTER_OPTIONS], teamId: true });
    }
    setSelectAll(!selectAll);
  };

  const handleTeamCheckboxChange = () => {
    setFilters({ ...filters, teamId: !filters.teamId });
  }; */

/* return (
    <div>
      <h4 className="py-4">Sía</h4>
      <p>
        Hakaðu í þær tegundir af viðvörunum sem þú vilt skoð. Veldu allar
        tegundir til að sjá allt.
      </p>
      <div className="flex flex-col gap-2 py-4">
        {FILTER_OPTIONS.map((option) => (
            <label key={option} className="flex items-center gap-2">
                <Checkbox
                    checked={filters.status.includes(option)}
                    onCheckedChange={() => handleStatusCheckboxChange(option)}
                />
                {option}
            </label>
        ))}
        </div>
        <label className="flex items-center gap-2">
            <Checkbox checked={filters.teamId} onCheckedChange={handleTeamCheckboxChange} />
            Mín teymi
        </label>
        <label className="flex items-center gap-2">
            <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
            Allar Tegundir viðvarana
        </label>
      
    </div>
  ); */

export default Filter;
