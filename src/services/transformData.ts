import { RawVitalRanges, SingleRange, VitalCategory } from "@/types/vitals";
import {
  BloodPressureRange,
  BloodSugarRange,
  BodyTemperatureRange,
  OxygenSaturationRange,
  BodyWeightRange,
} from "@/types/apiVitals";
import { VitalTransformKey, FixedRange } from "@/types/vitals";

//
const transformVitalData = (rawData?: RawVitalRanges) => {
  const ret: FixedRange[] = [
    {
      id: rawData?.bloodPressureRange.id,
      patientID: rawData?.bloodPressureRange.patientID,
      name: "bloodpressure",
      unit: "",
      ranges: [
        {
          name: "Raised",
          prefix: "<",
          displayText: "Lækkaður blóðþrýstingur",
          systolicLowered: rawData?.bloodPressureRange.systolicLowered,
          diastolicLowered: rawData?.bloodPressureRange.diastolicLowered,
        },
        {
          name: "Normal",
          prefix: "<",
          displayText: "Eðlilegur blóðþrýstingur",
          systolicGood: rawData?.bloodPressureRange.systolicGood,
          diastolicGood: rawData?.bloodPressureRange.diastolicGood,
        },
        {
          name: "Raised",
          prefix: "<",
          displayText: "Hækkaður blóðþrýstingur",
          systolicRaised: rawData?.bloodPressureRange.systolicRaised,
          diastolicRaised: rawData?.bloodPressureRange.diastolicRaised,
        },
        {
          name: "High",
          prefix: "<",
          displayText: "Hár háþrýstingur",
          systolicHigh: rawData?.bloodPressureRange.systolicHigh,
          diastolicHigh: rawData?.bloodPressureRange.diastolicHigh,
        },
      ],
    },
    {
      id: rawData?.bloodSugarRange.id,
      patientID: rawData?.bloodSugarRange.patientID,
      name: "bloodsugar",
      unit: "mmól/L",
      ranges: [
        {
          name: "Raised",
          prefix: ">",
          displayText: "Lækkaður blóðsykur",
          bloodSugarLowered: rawData?.bloodSugarRange.bloodSugarLowered,
        },
        {
          name: "Normal",
          prefix: ">",
          displayText: "Eðlilegur blóðsykur",
          bloodSugarGood: rawData?.bloodSugarRange.bloodSugarGood,
        },
        {
          name: "Raised",
          prefix: ">",
          displayText: "Hækkaður blóðsykur",
          bloodSugarRaised: rawData?.bloodSugarRange.bloodSugarRaised,
        },
        {
          name: "High",
          prefix: "<",
          displayText: "Hár blóðsykur",
          bloodSugarHigh: rawData?.bloodSugarRange.bloodSugarHigh,
        },
      ],
    },
    {
      id: rawData?.bodyTemperatureRange.id,
      patientID: rawData?.bodyTemperatureRange.patientID,
      name: "bodytemperature",
      unit: "°C",
      ranges: [
        {
          name: "Raised",
          prefix: "<",
          displayText: "Lækkaður hiti",
          bodyTemperatureUnderAverage:
            rawData?.bodyTemperatureRange.temperatureUnderAverage,
        },
        {
          name: "Normal",
          prefix: "<",
          displayText: "Eðlilegur hiti",
          bodyTemperatureGood: rawData?.bodyTemperatureRange.temperatureGood,
        },
        {
          name: "Raised",
          prefix: "<",
          displayText: "Hækkaður hiti",
          bodyTemperatureNotOk: rawData?.bodyTemperatureRange.temperatureNotOk,
        },
        {
          name: "High",
          prefix: "<",
          displayText: "Hár hiti",
          bodyTemperatureCritical:
            rawData?.bodyTemperatureRange.temperatureCritical,
        },
      ],
    },
    {
      id: rawData?.oxygenSaturationRange.id,
      patientID: rawData?.oxygenSaturationRange.patientID,
      name: "oxygensaturation",
      unit: "%",
      ranges: [
        {
          name: "Normal",
          prefix: ">",
          displayText: "Eðlileg súrefnismettun",
          oxygenSaturationGood:
            rawData?.oxygenSaturationRange.oxygenSaturationGood,
        },
        {
          name: "Raised",
          prefix: ">",
          displayText: "Lækkuð súrefnismettun",
          oxygenSaturationRaised:
            rawData?.oxygenSaturationRange.oxygenSaturationRaised,
        },
        {
          name: "High",
          prefix: "<",
          displayText: "Lág súrefnismettun",
          oxygenSaturationHigh:
            rawData?.oxygenSaturationRange.oxygenSaturationHigh,
        },
      ],
    },
    {
      id: rawData?.bodyWeightRange.id,
      patientID: rawData?.bodyWeightRange.patientID,
      name: "bodyweight",
      unit: "kg",
      ranges: [
        {
          name: "High",
          prefix: "-",
          displayText: "30 daga þyngdarminkun",
          bodyWeightLossFluctuationPercentageGood:
            rawData?.bodyWeightRange.weightLossFluctuationPercentageGood,
        },
        {
          name: "Normal",
          prefix: "-",
          displayText: "Þyngdarsveifla innan",
          bodyWeightGainPercentageGoodMax:
            rawData?.bodyWeightRange.weightGainPercentageGoodMax,
        },
        {
          name: "High",
          prefix: "+",
          displayText: "30 daga þyngdartap",
          bodyWeightGainFluctuationPercentageGood:
            rawData?.bodyWeightRange.weightGainFluctuationPercentageGood,
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
        if (range.name === "temperatureUnderAverage") {
          transformed[`${range.name}`] = Number(range.max);
        }
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
