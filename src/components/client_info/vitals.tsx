import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { useClientVitalRanges } from "@/hooks/useVitals";

import Loading from "@/components/loading";
import Error from "@/components/error";
import { Button } from "@/components/ui/button";
import OxygenSaturation from "@/components/client_info/vitals/oxygenSaturation";
import {
  BodyTemperatureRange,
  OxygenSaturationRange,
  BloodSugarRange,
  BloodPressureRange,
  BodyWeightRange,
} from "@/types/vitals";
import BodyTemperature from "@/components/client_info/vitals/bodyTemp";
import BloodSugar from "@/components/client_info/vitals/bloodSugar";
import BloodPressure from "@/components/client_info/vitals/bloodPressure";
import BodyWeight from "./vitals/weight";

const viewSettings = [
  {
    name: "Súrefnismettun",
    type: "oxygenSaturationRange",
  },
  {
    name: "Hiti",
    type: "bodyTemperatureRange",
  },
  {
    name: "Blóðsykur",
    type: "bloodSugarRange",
  },
  {
    name: "Blóðþrýstingur",
    type: "bloodPressureRange",
  },
  {
    name: "Þyngd",
    type: "bodyWeightRange",
  },
];

const Vitals = () => {
  const [view, setView] = useState(viewSettings[4]);
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");
  const { vitalRanges, error, isLoading } = useClientVitalRanges(
    Number(clientId)
  );

  const currentData = useMemo(() => {
    if (!vitalRanges) return null;
    return vitalRanges[view.type as keyof typeof vitalRanges];
  }, [vitalRanges, view.type]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  const handleChangeView = (newView: (typeof viewSettings)[0]) => {
    setView(newView);
  };

  return (
    <div className="flex p-4 flex-col gap-4">
      <div className="flex w-full bg-buttoncontainer rounded-md p-1 shadow-md">
        {viewSettings.map((measurement, index) => (
          <div key={index} className="flex-1 justify-center align-center">
            <Button
              className={`text-xs w-full h-7 shadow-none ${view.type === measurement.type ? "bg-primary" : "bg-opacity-100"}`}
              onClick={() => handleChangeView(measurement)}
            >
              {measurement.name}
            </Button>
          </div>
        ))}
      </div>
      <div>
        {view.type === "oxygenSaturationRange" && (
          <OxygenSaturation
            data={currentData as OxygenSaturationRange}
            clientId={clientId || ""}
          />
        )}
        {view.type === "bodyTemperatureRange" && (
          <BodyTemperature
            data={currentData as BodyTemperatureRange}
            clientId={clientId || ""}
          />
        )}
        {view.type === "bloodSugarRange" && (
          <BloodSugar
            data={currentData as BloodSugarRange}
            clientId={clientId || ""}
          />
        )}
        {view.type === "bloodPressureRange" && (
          <BloodPressure
            data={currentData as BloodPressureRange}
            clientId={clientId || ""}
          />
        )}
        {view.type === "bodyWeightRange" && (
          <BodyWeight
            data={currentData as BodyWeightRange}
            clientId={clientId || ""}
          />
        )}
      </div>
    </div>
  );
};

export default Vitals;
