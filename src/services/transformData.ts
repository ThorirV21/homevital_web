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
          name: "Normal",
          min: rawData?.bloodPressureRange.diastolicGood,
          max: rawData?.bloodPressureRange.diastolicGood,
        },
        {
          name: "Raised",
          min: rawData?.bloodPressureRange.diastolicOkMin,
          max: rawData?.bloodPressureRange.diastolicOkMax,
        },
        {
          name: "High stage 1",
          min: rawData?.bloodPressureRange.diastolicNotOkMin,
          max: rawData?.bloodPressureRange.diastolicNotOkMax,
        },
        {
          name: "High stage 2",
          min: rawData?.bloodPressureRange.diastolicCriticalMin,
          max: rawData?.bloodPressureRange.diastolicCriticalMax,
        },
        {
          name: "Critical",
          min: rawData?.bloodPressureRange.diastolicCriticalStage3Min,
          max: rawData?.bloodPressureRange.diastolicCriticalStage3Max,
        },
      ],
      distolicRanges: [
        {
          name: "Normal",
          min: rawData?.bloodPressureRange.systolicGood,
          max: rawData?.bloodPressureRange.systolicGood,
        },
        {
          name: "Raised",
          min: rawData?.bloodPressureRange.systolicOkMin,
          max: rawData?.bloodPressureRange.systolicOkMax,
        },
        {
          name: "High stage 1",
          min: rawData?.bloodPressureRange.systolicNotOkMin,
          max: rawData?.bloodPressureRange.systolicNotOkMax,
        },
        {
          name: "High stage 2",
          min: rawData?.bloodPressureRange.systolicCriticalMin,
          max: rawData?.bloodPressureRange.systolicCriticalMax,
        },
        {
          name: "Critical",
          min: rawData?.bloodPressureRange.systolicCriticalStage3Min,
          max: rawData?.bloodPressureRange.systolicCriticalStage3Max,
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
        },
        {
          name: "Good",
          min: rawData?.bodyWeightRange.weightGainPercentageGoodMax,
          max: rawData?.bodyWeightRange.weightGainPercentageGoodMax,
        },
        {
          name: "Weight Gain",
          min: rawData?.bodyWeightRange.weightGainFluctuationPercentageGood,
          max: rawData?.bodyWeightRange.weightGainFluctuationPercentageGood,
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
    id: number
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
  bloodpressure: (ranges: SingleRange[], patientId: number, id: number) => ({
    id: id,
    patientID: patientId,
    systolicGood: Number(ranges[0].min),
    systolicOkMin: Number(ranges[1].min),
    systolicOkMax: Number(ranges[1].max),
    systolicNotOkMin: Number(ranges[2].min),
    systolicNotOkMax: Number(ranges[2].max),
    systolicCriticalMin: Number(ranges[3].min),
    systolicCriticalMax: Number(ranges[3].max),
    diastolicGood: Number(ranges[0].min),
    diastolicOkMin: Number(ranges[1].min),
    diastolicOkMax: Number(ranges[1].max),
    diastolicNotOkMin: Number(ranges[2].min),
    diastolicNotOkMax: Number(ranges[2].max),
    diastolicCriticalMin: Number(ranges[3].min),
    diastolicCriticalMax: Number(ranges[3].max),
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

export { transformVitalData };
