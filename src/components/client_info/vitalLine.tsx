import { SingleRange, vitalSettings } from "@/types/vitals";
import Circle from "../icons/circle";
import { Input } from "../ui/input";
import { ChangeEvent } from "react";

const VitalLine = ({
  data,
  distolicRanges,
  settings,
  index,
  editing,
  handleChangeData,
}: {
  data: SingleRange;
  distolicRanges?: SingleRange;
  settings: vitalSettings;
  index: number;
  editing: boolean;
  handleChangeData: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  console.log(editing);
  console.log(distolicRanges);
  console.log(data);
  return (
    <div className="flex flex-wrap p-5 items-center w-full">
      <div className="w-1/2 items-center flex gap-10">
        <Circle
          className={`h-16 w-16 flex-shrink-0 ${settings.colors[index]}`}
        />
        <div>
          <p className="font-bold">{settings.texts[index]}</p>
          {editing ? (
            <div className="flex gap-2 items-center">
              <Input
                id={data.name}
                name="min"
                defaultValue={data.min ?? ""}
                onChange={(e) => handleChangeData(e)}
                className="w-16 text-center"
              />
              <p>-</p>
              <Input
                id={data.name}
                name="max"
                value={data.max ?? ""}
                onChange={(e) => handleChangeData(e)}
                className="w-16 text-center"
              />
              <p>{settings.type}</p>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <p>
                {data.min} - {data.max}
              </p>
              <p>{settings.type}</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-1/4 flex justify-center"></div>
      <div className="w-1/4 flex justify-center"></div>
    </div>
  );
};

export default VitalLine;
