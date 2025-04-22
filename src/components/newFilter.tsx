import { FilterType, FilterProps } from "@/types/filterTypes";
import { Button } from "./ui/button";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Image from "next/image";

const Filter = ({
  setPopoverOpen,
  filters,
  setFilters,
  popoverOpen,
}: {
  setPopoverOpen: (open: boolean) => void;
  filters: FilterProps;
  setFilters: (filters: FilterProps) => void;
  popoverOpen: boolean;
}) => {
  const [newFilters, setNewFilters] = useState<FilterType[]>(filters.items);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;

    if (id === "allt") {
      setNewFilters(
        newFilters.map((filter) => ({
          ...filter,
          checked: checked,
        }))
      );
    } else {
      let updatedFilter = newFilters;
      updatedFilter = updatedFilter.map((filter) =>
        filter.id === id ? { ...filter, checked } : filter
      );

      if (updatedFilter?.map((filter) => filter.checked === false)) {
        const alltFilter = updatedFilter.find((filter) => filter.id === "allt");
        if (alltFilter) {
          updatedFilter = updatedFilter.map((filter) =>
            filter.id === "allt" ? { ...filter, checked: false } : filter
          );
        }
      }
      setNewFilters(updatedFilter);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFilters({
      ...filters,
      items: newFilters,
    });
    setPopoverOpen(false);
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger>
          <div className="inline-flex rounded-2xl ml-auto pr-2">
            <p className="text-xl pr-5 pl-2">Sía</p>
            <Image src="/Tune.svg" alt="Filter" width={30} height={30} />
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold text-foreground">
                {filters.header}
              </h1>
              <p className="text-foreground pt-2 pb-4">{filters.description}</p>
            </div>
            {newFilters.map((item) => (
              <div
                key={item.id}
                className={`flex flex-row gap-2 ${item.id === "allt" ? "py-8" : "py-2"}`}
              >
                <input
                  type="checkbox"
                  id={item.id}
                  checked={
                    newFilters.find((f) => f.id === item.id)?.checked || false
                  }
                  onChange={handleChange}
                />
                <label htmlFor={item.id} className="text-foreground">
                  {item.name}
                </label>
              </div>
            ))}
            <div className="flex flex-row gap-2 justify-end pt-4">
              <Button type="submit">Velja</Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default Filter;
