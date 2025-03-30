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
  const distolicRangesString = () => {
    if (distolicRanges) {
      if (distolicRanges.prefix) {
        return ` / ${distolicRanges.prefix} ${distolicRanges.max}`;
      } else {
        return ` / ${distolicRanges.min} - ${distolicRanges.max}`;
      }
    }
    return "";
  };

  const inputClasses = "w-14 text-center text-sm !px-0";

  const distolicRangesEditing = () => {
    if (distolicRanges) {
      if (distolicRanges.prefix) {
        return (
          <>
            <p> / </p>
            <p>{distolicRanges.prefix}</p>
            <Input
              id={distolicRanges.name}
              name="distolic-max"
              value={distolicRanges.max ?? ""}
              onChange={(e) => handleChangeData(e)}
              className={inputClasses}
              type="number"
              min={settings.min}
              max={settings.max}
              step={settings.data === "bodytemperature" ? "0.1" : "1"}
            />
          </>
        );
      } else {
        return (
          <>
            <p> / </p>
            <Input
              id={distolicRanges.name}
              name="distolic-min"
              value={distolicRanges.min ?? ""}
              onChange={(e) => handleChangeData(e)}
              className={inputClasses}
              type="number"
              min={settings.min}
              max={settings.max}
              step={settings.data === "bodytemperature" ? "0.1" : "1"}
            />
            <p>-</p>
            <Input
              id={distolicRanges.name}
              name="distolic-max"
              value={distolicRanges.max ?? ""}
              onChange={(e) => handleChangeData(e)}
              className={inputClasses}
              type="number"
              min={settings.min}
              max={settings.max}
              step={settings.data === "bodytemperature" ? "0.1" : "1"}
            />
          </>
        );
      }
    }
  };

  return (
    <div className="flex flex-wrap p-5 items-center w-full">
      {distolicRanges ? "" : ""}
      <div className="w-3/5 items-center flex gap-10">
        <Circle
          className={`h-14 w-14 flex-shrink-0 ${settings.colors[index]}`}
        />
        <div>
          <p className="font-bold">{settings.texts[index]}</p>
          {editing ? (
            <div className="flex gap-2 items-center">
              {data.prefix ? (
                <p>{data.prefix}</p>
              ) : (
                <>
                  <Input
                    id={data.name}
                    name="min"
                    defaultValue={data.min ?? ""}
                    onChange={(e) => handleChangeData(e)}
                    className={inputClasses}
                    type="number"
                    min={settings.min}
                    max={settings.max}
                    step={settings.data === "bodytemperature" ? "0.1" : "1"}
                  />
                  <p>-</p>
                </>
              )}
              {data.name === "Weight Loss" ? "- " : ""}
              {data.name === "Weight Gain" ? "+ " : ""}
              <Input
                id={data.name}
                name="max"
                value={data.max ?? ""}
                onChange={(e) => handleChangeData(e)}
                className={inputClasses}
                type="number"
                min={settings.min}
                max={settings.max}
                step={settings.data === "bodytemperature" ? "0.1" : "1"}
              />
              {distolicRangesEditing()}
              <p>{settings.type}</p>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <p>
                {data.prefix ? data.prefix : `${data.min} - `}
                {data.name === "Weight Loss" ? "- " : ""}
                {data.name === "Weight Gain" ? "+ " : ""}
                {data.max}
                {distolicRangesString()}
              </p>
              <p>{settings.type}</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-1/5 flex justify-center"></div>
      <div className="w-1/5 flex justify-center"></div>
    </div>
  );
};

export default VitalLine;
