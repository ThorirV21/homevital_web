import { RawVitalRanges, SingleRange, VitalCategory } from "@/types/vitals";
import {
  BloodPressureRange,
  BloodSugarRange,
  BodyTemperatureRange,
  OxygenSaturationRange,
  BodyWeightRange,
} from "@/types/apiVitals";
import { VitalTransformKey } from "@/types/vitals";

//
const transformVitalData = (rawData?: RawVitalRanges) => {
  const ret: VitalCategory[] = [
    {
      id: rawData?.bloodPressureRange.id,
      patientId: rawData?.bloodPressureRange.patientID,
      name: "bloodpressure",
      ranges: [
        {
          name: "systolicGood",
          max: rawData?.bloodPressureRange.systolicGoodMax,
          prefix: "< ",
        },
        {
          name: "systolicOk",
          min: rawData?.bloodPressureRange.systolicOkMin,
          max: rawData?.bloodPressureRange.systolicOkMax,
        },
        {
          name: "systolicNotOk",
          min: rawData?.bloodPressureRange.systolicNotOkMin,
          max: rawData?.bloodPressureRange.systolicNotOkMax,
        },
        {
          name: "systolicCritical",
          min: rawData?.bloodPressureRange.systolicCriticalMin,
          max: rawData?.bloodPressureRange.systolicCriticalMax,
          prefix: "> ",
        },
        {
          name: "systolicCriticalStage3",
          min: rawData?.bloodPressureRange.systolicCriticalStage3Min,
          max: rawData?.bloodPressureRange.systolicCriticalStage3Max,
          prefix: "> ",
        },
      ],
      distolicRanges: [
        {
          name: "diastolicGood",
          max: rawData?.bloodPressureRange.diastolicGoodMax,
          prefix: "< ",
        },
        {
          name: "diastolicOk",
          min: rawData?.bloodPressureRange.diastolicOkMin,
          max: rawData?.bloodPressureRange.diastolicOkMax,
          prefix: "< ",
        },
        {
          name: "diastolicNotOk",
          min: rawData?.bloodPressureRange.diastolicNotOkMin,
          max: rawData?.bloodPressureRange.diastolicNotOkMax,
        },
        {
          name: "diastolicCritical",
          min: rawData?.bloodPressureRange.diastolicCriticalMin,
          max: rawData?.bloodPressureRange.diastolicCriticalMax,
          prefix: "> ",
        },
        {
          name: "diastolicCriticalStage3",
          min: rawData?.bloodPressureRange.diastolicCriticalStage3Min,
          max: rawData?.bloodPressureRange.diastolicCriticalStage3Max,
          prefix: "> ",
        },
      ],
    },
    {
      id: rawData?.bloodSugarRange.id,
      patientId: rawData?.bloodSugarRange.patientID,
      name: "bloodsugar",
      ranges: [
        {
          name: "Good",
          min: rawData?.bloodSugarRange.bloodSugarGoodMin,
          max: rawData?.bloodSugarRange.bloodSugarGoodMax,
        },
        {
          name: "Not Ok",
          min: rawData?.bloodSugarRange.bloodSugarNotOkMin,
          max: rawData?.bloodSugarRange.bloodSugarNotOkMax,
        },
        {
          name: "Critical",
          min: rawData?.bloodSugarRange.bloodSugarCriticalMin,
          max: rawData?.bloodSugarRange.bloodSugarCriticalMax,
          prefix: "< ",
        },
      ],
    },
    {
      id: rawData?.bodyTemperatureRange.id,
      patientId: rawData?.bodyTemperatureRange.patientID,
      name: "bodytemperature",
      ranges: [
        {
          name: "Under Average",
          max: rawData?.bodyTemperatureRange.temperatureUnderAverage,
          prefix: "< ",
        },
        {
          name: "Good",
          min: rawData?.bodyTemperatureRange.temperatureGoodMin,
          max: rawData?.bodyTemperatureRange.temperatureGoodMax,
        },
        {
          name: "Not Ok",
          min: rawData?.bodyTemperatureRange.temperatureNotOkMin,
          max: rawData?.bodyTemperatureRange.temperatureNotOkMax,
        },
        {
          name: "Critical",
          min: rawData?.bodyTemperatureRange.temperatureCriticalMin,
          max: rawData?.bodyTemperatureRange.temperatureCriticalMax,
        },
      ],
    },
    {
      id: rawData?.oxygenSaturationRange.id,
      patientId: rawData?.oxygenSaturationRange.patientID,
      name: "oxygensaturation",
      ranges: [
        {
          name: "Good",
          min: rawData?.oxygenSaturationRange.oxygenSaturationGood,
          max: rawData?.oxygenSaturationRange.oxygenSaturationGood,
          prefix: "> ",
        },
        {
          name: "Lowered",
          min: rawData?.oxygenSaturationRange.oxygenSaturationOkMin,
          max: rawData?.oxygenSaturationRange.oxygenSaturationOkMax,
        },
        {
          name: "Low",
          min: rawData?.oxygenSaturationRange.oxygenSaturationNotOkMin,
          max: rawData?.oxygenSaturationRange.oxygenSaturationNotOkMax,
        },
        {
          name: "Critical",
          min: rawData?.oxygenSaturationRange.oxygenSaturationCriticalMin,
          max: rawData?.oxygenSaturationRange.oxygenSaturationCriticalMax,
          prefix: "< ",
        },
      ],
    },
    {
      id: rawData?.bodyWeightRange.id,
      patientId: rawData?.bodyWeightRange.patientID,
      name: "bodyweight",
      ranges: [
        {
          name: "Weight Loss",
          min: rawData?.bodyWeightRange.weightLossFluctuationPercentageGood,
          max: rawData?.bodyWeightRange.weightLossFluctuationPercentageGood,
          prefix: "> ",
        },
        {
          name: "Good",
          min: rawData?.bodyWeightRange.weightGainPercentageGoodMax,
          max: rawData?.bodyWeightRange.weightGainPercentageGoodMax,
          prefix: " ",
        },
        {
          name: "Weight Gain",
          min: rawData?.bodyWeightRange.weightGainFluctuationPercentageGood,
          max: rawData?.bodyWeightRange.weightGainFluctuationPercentageGood,
          prefix: "> ",
        },
      ],
    },
  ];
  return ret;
};

export const transformVitalRanges: Record<
  VitalTransformKey,
  (
    ranges: SingleRange[],
    patientId: number,
    id: number,
    distolicRanges?: SingleRange[]
  ) =>
    | BodyTemperatureRange
    | BloodPressureRange
    | BloodSugarRange
    | OxygenSaturationRange
    | BodyWeightRange
> = {
  bodytemperature: (ranges: SingleRange[], patientId: number, id: number) => ({
    id: id,
    patientID: patientId,
    bodyTemperatureGoodMin: Number(ranges[1].min),
    bodyTemperatureGoodMax: Number(ranges[1].max),
    bodyTemperatureUnderAverage: Number(ranges[0].max),
    bodyTemperatureNotOkMin: Number(ranges[2].min),
    bodyTemperatureNotOkMax: Number(ranges[2].max),
    bodyTemperatureCriticalMin: Number(ranges[3].min),
    bodyTemperatureCriticalMax: Number(ranges[3].max),
  }),
  bloodpressure: (
    ranges: SingleRange[],
    patientId: number,
    id: number,
    distolicRanges?: SingleRange[]
  ) => ({
    id: id,
    patientID: patientId,
    systolicGoodMax: Number(ranges[0].max),
    systolicOkMin: Number(ranges[1].min),
    systolicOkMax: Number(ranges[1].max),
    systolicNotOkMin: Number(ranges[2].min),
    systolicNotOkMax: Number(ranges[2].max),
    systolicCriticalMin: Number(ranges[3].min),
    systolicCriticalMax: Number(ranges[3].max),
    systolicCriticalStage3Min: Number(ranges[4].min),
    systolicCriticalStage3Max: Number(ranges[4].max),
    diastolicGoodMax: Number(distolicRanges?.[0].max),
    diastolicOkMin: Number(distolicRanges?.[1].min),
    diastolicOkMax: Number(distolicRanges?.[1].max),
    diastolicNotOkMin: Number(distolicRanges?.[2].min),
    diastolicNotOkMax: Number(distolicRanges?.[2].max),
    diastolicCriticalMin: Number(distolicRanges?.[3].min),
    diastolicCriticalMax: Number(distolicRanges?.[3].max),
    diastolicCriticalStage3Min: Number(distolicRanges?.[4].min),
    diastolicCriticalStage3Max: Number(distolicRanges?.[4].max),
  }),
  bloodsugar: (ranges: SingleRange[], patientId: number, id: number) => ({
    id: id,
    patientID: patientId,
    bloodSugarGoodMin: Number(ranges[0].min),
    bloodSugarGoodMax: Number(ranges[0].max),
    bloodSugarNotOkMin: Number(ranges[1].min),
    bloodSugarNotOkMax: Number(ranges[1].max),
    bloodSugarCriticalMin: Number(ranges[2].min),
    bloodSugarCriticalMax: Number(ranges[2].max),
  }),
  oxygensaturation: (ranges: SingleRange[], patientId: number, id: number) => ({
    id: id,
    patientID: patientId,
    oxygenSaturationGood: Number(ranges[0].max),
    oxygenSaturationOkMin: Number(ranges[1].min),
    oxygenSaturationOkMax: Number(ranges[1].max),
    oxygenSaturationNotOkMin: Number(ranges[2].min),
    oxygenSaturationNotOkMax: Number(ranges[2].max),
    oxygenSaturationCriticalMin: Number(ranges[3].min),
    oxygenSaturationCriticalMax: Number(ranges[3].max),
  }),
  bodyweight: (ranges: SingleRange[], patientId: number, id: number) => ({
    id: id,
    patientID: patientId,
    weightGainPercentageGoodMax: Number(ranges[0].min),
    weightLossPercentageGoodMax: Number(ranges[0].max),
    weightGainFluctuationPercentageGood: Number(ranges[1].min),
    weightLossFluctuationPercentageGood: Number(ranges[1].max),
    weightGainFluctuationPercentageCriticalMin: Number(ranges[2].min),
    weightLossFluctuationPercentageCriticalMax: Number(ranges[2].max),
  }),
};

interface TransformedVitalRange {
  id: number | string | undefined;
  patientID: number | string | undefined;
  [key: string]: string | number | undefined; // Index signature for dynamic properties
}

const transformForApi = (data: VitalCategory): TransformedVitalRange => {
  const transformed: TransformedVitalRange = {
    id: data.id,
    patientID: data.patientId,
  };

  if (data.name === "bloodpressure") {
    // Handle systolic ranges
    data.ranges.forEach((range) => {
      if (range.name === "systolicGood") {
        transformed.systolicGoodMax = Number(range.max);
      } else if (range.name === "systolicOk") {
        transformed.systolicOkMin = Number(range.min);
        transformed.systolicOkMax = Number(range.max);
      } else if (range.name === "systolicNotOk") {
        transformed.systolicNotOkMin = Number(range.min);
        transformed.systolicNotOkMax = Number(range.max);
      } else if (range.name === "systolicCritical") {
        transformed.systolicCriticalMin = Number(range.min);
        transformed.systolicCriticalMax = Number(range.max);
      } else if (range.name === "systolicCriticalStage3") {
        transformed.systolicCriticalStage3Min = Number(range.min);
        transformed.systolicCriticalStage3Max = Number(range.max);
      }
    });

    // Handle diastolic ranges
    data.distolicRanges?.forEach((range) => {
      if (range.name === "diastolicGood") {
        transformed.diastolicGoodMax = Number(range.max);
      } else if (range.name === "diastolicOk") {
        transformed.diastolicOkMin = Number(range.min);
        transformed.diastolicOkMax = Number(range.max);
      } else if (range.name === "diastolicNotOk") {
        transformed.diastolicNotOkMin = Number(range.min);
        transformed.diastolicNotOkMax = Number(range.max);
      } else if (range.name === "diastolicCritical") {
        transformed.diastolicCriticalMin = Number(range.min);
        transformed.diastolicCriticalMax = Number(range.max);
      } else if (range.name === "diastolicCriticalStage3") {
        transformed.diastolicCriticalStage3Min = Number(range.min);
        transformed.diastolicCriticalStage3Max = Number(range.max);
      }
    });
  } else {
    // Handle other vital types
    data.ranges.forEach((range) => {
      if (range.name) {
        if (range.min !== undefined) {
          transformed[`${range.name}Min`] = Number(range.min);
        }
        if (range.max !== undefined) {
          transformed[`${range.name}Max`] = Number(range.max);
        }
      }
    });
  }

  return transformed;
};

export { transformVitalData, transformForApi };
