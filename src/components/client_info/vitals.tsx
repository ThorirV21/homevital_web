import { ChangeEvent, useState } from "react";
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
  const [view, setView] = useState(currentView[0]);
  const searchParams = useSearchParams();
  const clientId = searchParams.get("id");
  const { vitalRanges, error, isLoading, refetch } = useClientVitalRanges(
    Number(clientId)
  );
  const [editing, setEditing] = useState(false);
  const { updateMutation } = useVitalRangeMutations(Number(clientId));
  const [currentData, setCurrentData] = useState<VitalCategory | undefined>(
    undefined
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  // Set initial currentData if it's not set yet
  if (!currentData) {
    const foundVital = vitalRanges.find((vital) => vital.name === view.data);
    setCurrentData(foundVital);
  }

  const handleChangeView = (view: vitalSettings) => {
    const foundVital = vitalRanges.find((vital) => vital.name === view.data);
    setCurrentData(foundVital);
    console.log(foundVital);
    setEditing(false);
    setView(view);
  };

  const handleChangeData = (e: ChangeEvent<HTMLInputElement>) => {
    if (typeof currentData === "undefined") {
      return;
    }

    const copyData: VitalCategory = { ...currentData };

    copyData?.ranges?.map((range) => {
      if (range.name === e.target.id) {
        if (e.target.name === "min") {
          range.min = e.target.value.replace(",", ".");
        } else {
          range.max = e.target.value.replace(",", ".");
        }
      }
    });

    setCurrentData({ ...copyData });
  };

  const handleChangeEditing = () => {
    if (editing) {
      setEditing(false);
    } else {
      setEditing(true);
    }
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

      updateMutation.mutate(
        {
          clientId: Number(clientId),
          id: Number(currentData.id),
          data: currentData.ranges,
          type: view.data,
        },
        {
          onSuccess: () => {
            refetch();
            setEditing(false);
            console.log("Successfully saved data");
            const foundVital = vitalRanges.find(
              (vital) => vital.name === view.data
            );
            setCurrentData(foundVital);
          },
          onError: (error) => {
            console.error("Error saving data:", error);
          },
        }
      );
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

        <div className="pb-14 px-14">
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
