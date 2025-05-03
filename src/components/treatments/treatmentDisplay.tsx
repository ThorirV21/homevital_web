"use client";
import { is } from "date-fns/locale";

import formatDateIS from "@/services/dateFormatter";
import { TreatmentType } from "@/types/treatmentTypes";
import { Calendar } from "@/components/ui/calendar";
import { selectedDates } from "@/services/treatmentPlan";

interface TreatmentDisplayProps {
  treatment: TreatmentType;
}

const TreatmentDisplay = ({ treatment }: TreatmentDisplayProps) => {
  console.log(treatment);
  console.log(treatment.weightMeasurementDays);

  const measurementDays = (Days: number[] = []) => {
    return Days.reduce((count, day) => count + (day === 1 ? 1 : 0), 0);
  };

  const measurementText = (Days: number[] = []) => {
    const times = measurementDays(Days);
    if (times === 0) return "";
    if (times === 1) return "vikulega";

    return `${times} sinnum í viku`;
  };

  return (
    <div className="w-full grid grid-cols-2 gap-6 px-6 py-4">
      <div className="col-1 flex flex-col gap-4">
        <div className="flex flex-col">
          <h4 className="text-md">Nafn áætlunar</h4>
          <h1 className="text-xl">{treatment.name}</h1>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex flex-col">
            <h4 className="text-md">Upphafs dags.</h4>
            <h1 className="text-xl">{formatDateIS(treatment.startDate)}</h1>
          </div>
          <div className="flex flex-col">
            <h4 className="text-md">Endir</h4>
            <h1 className="text-xl">{formatDateIS(treatment.endDate)}</h1>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-md">Mælingar</h4>
          {measurementDays(treatment.weightMeasurementDays) > 0 && (
            <h1 className="text-xl">
              Vigtun {measurementText(treatment.weightMeasurementDays)}
            </h1>
          )}
          {measurementDays(treatment.bloodSugarMeasurementDays) > 0 && (
            <h1 className="text-xl">
              Blóðsykurs {measurementText(treatment.bloodSugarMeasurementDays)}
            </h1>
          )}
          {measurementDays(treatment.bloodPressureMeasurementDays) > 0 && (
            <h1 className="text-xl">
              Blóðþrýstings{" "}
              {measurementText(treatment.bloodPressureMeasurementDays)}
            </h1>
          )}
          {measurementDays(treatment.oxygenSaturationMeasurementDays) > 0 && (
            <h1 className="text-xl">
              Súrefnismettunar{" "}
              {measurementText(treatment.oxygenSaturationMeasurementDays)}
            </h1>
          )}
          {measurementDays(treatment.bodyTemperatureMeasurementDays) > 0 && (
            <h1 className="text-xl">
              Líkamshiti{" "}
              {measurementText(treatment.bodyTemperatureMeasurementDays)}
            </h1>
          )}
        </div>
        <div className="mt-auto">
          <h4 className="text-md">Leiðbeiningar</h4>
          <h1 className="text-xl pt-2">{treatment.instructions}</h1>
        </div>
      </div>
      <div className="col-2 flex flex-col gap-6">
        <div>
          <h4 className="text-md">Form</h4>
          <h1 className="text-xl">Sárateymi áætlun 1</h1>
        </div>
        <div>
          <h4 className="text-md">Teymi</h4>
          <h1 className="text-xl">Sárateymi</h1>
        </div>
        <div>
          <h4 className="text-md">Fræðsla</h4>
          <h1 className="text-xl">Vatnsdrykkja</h1>
          <h1 className="text-xl">Hreyfing</h1>
        </div>
        <div>
          <div className="flex flex-row gap-2">
            <Calendar
              mode="multiple"
              locale={is}
              className="h-80 w-full flex bg-white"
              selected={selectedDates(treatment)}
              classNames={{
                months:
                  "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                month: "space-y-4 w-full flex flex-col",
                table: "w-full h-full border-collapse space-y-1",
                head_row: "",
                row: "w-full mt-2",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDisplay;
