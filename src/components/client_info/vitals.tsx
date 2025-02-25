import { useState } from "react";
import { Button } from "../ui/button";

const measurements = [
  "Súrefnismettun",
  "Hiti",
  "Blóðsykur",
  "Blóðþrýstingur",
  "Vigt",
];

const Vitals = () => {
  const [view, setView] = useState("Súrefnismettun");

  return (
    <div className="flex p-2">
      {measurements.map((measurement) => (
        <div key={measurement} className="w-1/5 ">
          <Button
            className={`text-xs w-full h-6 place-content-center ${view === measurement ? "" : "opacity-50"}`}
            onClick={() => setView(measurement)}
          >
            {measurement}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Vitals;
