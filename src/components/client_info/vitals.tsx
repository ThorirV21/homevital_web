import { ChangeEvent, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import {
  useClientVitalRanges,
  useVitalRangeMutations,
} from "@/hooks/useVitals";
import VitalLine from "./vitalLine";
import { VitalCategory, vitalSettings } from "@/types/vitals";
import Pen from "../icons/pen";
import Loading from "@/components/loading";
import Error from "@/components/error";
/* const measurements = [
  "Súrefnismettun",
  "Hiti",
  "Blóðsykur",
  "Blóðþrýstingur",
  "Vigt", 
]; */

const currentView: vitalSettings[] = [
  {
    name: "Súrefnismettun",
    data: "oxygensaturation",
    texts: [
      "Eðlileg súrefnismettun",
      "Lækkuð súrefnismettun",
      "Súrefnismettun",
      "Lág súrefnismettun",
    ],
    colors: ["alarm1", "alarm2", "alarm3", "alarm4"],
    type: "%",
    min: 0,
    max: 100,
  },
  {
    name: "Hiti",
    data: "bodytemperature",
    texts: ["Undir meðallagi", "Eðlilegur hiti", "Yfir meðallagi", "Hiti"],
    colors: ["alarm2", "alarm1", "alarm3", "alarm4"],
    type: "°C",
    min: 30,
    max: 45,
  },
  {
    name: "Blóðsykur",
    data: "bloodsugar",
    texts: ["Eðlilegur blóðsykur", "Hækkaður blóðsykur", "Hár blóðsykur"],
    colors: ["alarm1", "alarm2", "alarm4"],
    type: "mg/dL",
    min: 0,
    max: 200,
  },
  {
    name: "Blóðþrýstingur",
    data: "bloodpressure",
    texts: [
      "Eðlilegur blóðþrýstingur",
      "Hækkaður blóðþrýstingur",
      "Háþrýstingur stig 1",
      "Háþrýstingur stig 2",
      "Alvarlegur háþrýstingur",
    ],
    colors: ["alarm1", "alarm2", "alarm3", "alarm4", "alarm5"],
    type: "",
    min: 0,
    max: 200,
  },
  {
    name: "Vigt",
    data: "bodyweight",
    texts: [
      "30 daga þyngdaraukning",
      "Þyngdarsveifla innan",
      "30 daga þyngdarminkun",
    ],
    colors: ["alarm4", "alarm1", "alarm4"],
    type: "%",
    min: 0,
    max: 100,
  },
];

const Vitals = () => {
  const [view, setView] = useState(currentView[4]);
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");
  const { vitalRanges, error, isLoading, refetch } = useClientVitalRanges(
    Number(clientId)
  );
  const [editing, setEditing] = useState(true);
  const { updateMutation } = useVitalRangeMutations(Number(clientId));
  const [currentData, setCurrentData] = useState<VitalCategory | undefined>(
    undefined
  );

  // Combined effect to handle both initial load and view changes
  useEffect(() => {
    if (!vitalRanges?.length) return;

    const foundVital = vitalRanges.find((vital) => vital.name === view.data);
    if (!foundVital) return;

    // Only update if data is different
    if (!currentData || currentData.name !== foundVital.name) {
      setCurrentData({ ...foundVital });
    }
  }, [vitalRanges, view.data, currentData]); // Only depend on currentData.name instead of entire object

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  const handleChangeView = (newView: vitalSettings) => {
    setView(newView);
    setEditing(false);
  };

  const handleChangeData = (e: ChangeEvent<HTMLInputElement>) => {
    if (!currentData) return;

    const copyData = { ...currentData };
    const fieldName = e.target.id;
    const fieldType = e.target.name;

    // Only allow numbers and decimal point
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");

    // Convert to number and clamp between min and max
    let value = numericValue;
    const numberValue = parseFloat(numericValue);
    if (!isNaN(numberValue)) {
      const clampedValue = Math.min(Math.max(numberValue, view.min), view.max);
      value = clampedValue.toString();
    }

    if (view.data === "bloodpressure") {
      if (fieldType === "distolic-min" || fieldType === "distolic-max") {
        copyData.distolicRanges = copyData.distolicRanges?.map((range) => {
          if (range.name === fieldName) {
            return {
              ...range,
              [fieldType === "distolic-min" ? "min" : "max"]: value,
            };
          }
          return range;
        });
      } else {
        copyData.ranges = copyData.ranges.map((range) => {
          if (range.name === fieldName) {
            return {
              ...range,
              [fieldType]: value,
            };
          }
          return range;
        });
      }
    } else {
      copyData.ranges = copyData.ranges.map((range) => {
        if (range.name === fieldName) {
          return {
            ...range,
            [fieldType]: value,
          };
        }
        return range;
      });
    }

    setCurrentData(copyData);
  };

  const handleChangeEditing = () => {
    setEditing(!editing);
  };

  const handleSaveData = () => {
    const saveDataToAPI = async () => {
      if (
        !currentData ||
        !clientId ||
        !currentData.id ||
        typeof currentData.id !== "number"
      )
        return;

      try {
        await updateMutation.mutateAsync({
          clientId: Number(clientId),
          id: Number(currentData.id),
          data: currentData.ranges,
          type: view.data,
          distolicRanges: currentData.distolicRanges,
        });

        await refetch();
        setEditing(false);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };
    saveDataToAPI();
  };

  return (
    <div className="flex p-4 flex-col  gap-4">
      <div className="flex w-full ">
        {currentView.map((value) => (
          <div key={value.name} className="w-1/5 ">
            <Button
              className={`text-xs w-full h-6 place-content-center ${view.name === value.name ? "" : "opacity-50"}`}
              onClick={() => handleChangeView(value)}
            >
              {value.name}
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-col h-[92%] w-full border-primary border-2">
        <div className="flex flex-row p-6 items-center w-full">
          {editing ? (
            <div className="flex gap-2 items-center pl-14 ">
              <Button
                size="lg"
                className="text-lg"
                onClick={() => handleSaveData()}
              >
                Vista
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
            onClick={handleChangeEditing}
          >
            <Pen
              className="!h-full !w-full text-primary"
              onClick={handleChangeEditing}
            />
          </Button>
        </div>

        <div className="flex flex-col pb-14 pl-4">
          {currentData ? (
            currentData.ranges.map((range, index) => (
              <VitalLine
                key={index}
                data={range}
                settings={view}
                index={index}
                editing={editing}
                handleChangeData={handleChangeData}
                distolicRanges={currentData.distolicRanges?.[index]}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vitals;
