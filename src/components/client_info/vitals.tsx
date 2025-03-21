import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useClientVitalRanges } from "@/hooks/useVitals";
import VitalLine from "./vitalLine";
import { VitalCategory, vitalSettings } from "@/types/vitals";
import Pen from "../icons/pen";

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
    data: "Oxygen Saturation",
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
    data: "Body Temperature",
    texts: ["Undir meðallagi", "Eðlilegur hiti", "Yfir meðallagi", "Hiti"],
    colors: ["alarm2", "alarm1", "alarm3", "alarm4"],
    type: "°C",
    min: 30,
    max: 45,
  },
  {
    name: "Blóðsykur",
    data: "Blood Sugar",
    texts: ["Eðlilegur blóðsykur", "Hækkaður blóðsykur", "Hár blóðsykur"],
    colors: ["alarm1", "alarm2", "alarm4"],
    type: "mmol/L",
    min: 0,
    max: 200,
  },
  {
    name: "Blóðþrýstingur",
    data: "Blood Pressure",
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
    data: "Body Weight",
    texts: [
      "30 daga þyngdaraukning",
      "Þyngdarsveifla innan",
      "30 daga þyngdarminkun",
    ],
    colors: ["alarm4", "alarm1", "alarm4"],
    type: "kg",
    min: 0,
    max: 100,
  },
];

const Vitals = () => {
  const [view, setView] = useState(currentView[3]);
  const { vitalRanges, error, isLoading } = useClientVitalRanges(1);
  const [editing, setEditing] = useState(true);

  const [currentData, setCurrentData] = useState<VitalCategory | undefined>(
    undefined
  );

  useEffect(() => {
    const foundVital = vitalRanges.find((vital) => vital.name === view.data);

    setCurrentData((prevData) => {
      if (prevData?.ranges[0].min === foundVital?.ranges[0].min) {
        return prevData; // ✅ Prevents re-render if no change
      }
      console.log("Updating currentData...", foundVital);
      return foundVital; // ✅ Only update if it actually changes
    });
  }, [vitalRanges, view]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  //console.log(vitalRanges);
  const handleChangeView = (view: vitalSettings) => {
    console.log("changing view");
    setView(view);
    setCurrentData(vitalRanges.find((vital) => vital.name === view.data));
  };

  const handleChangeData = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.id);
    console.log(e.target.name);
    console.log(e.target.value);

    const copyData = currentData;

    copyData?.ranges.map((range) => {
      if (range.name === e.target.id) {
        if (e.target.name === "min") {
          range.min = parseInt(e.target.value);
        } else {
          range.max = parseInt(e.target.value);
        }
      }
    });

    setCurrentData(copyData);
  };

  const handleChangeEditing = () => {
    console.log("changing editing");
    if (editing) {
      setEditing(false);
    } else {
      setEditing(true);
    }
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
              <Button size="lg" className="text-lg">
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
              />
            ))
          ) : (
            <></>
          )}
          ;
        </div>
      </div>
    </div>
  );
};

export default Vitals;
