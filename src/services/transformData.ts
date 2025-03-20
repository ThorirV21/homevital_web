import { RawVitalRanges, VitalCategory } from "@/types/vitals";

//
const transformVitalData = (rawData?: RawVitalRanges) => {
  const ret: VitalCategory[] = [
    {
      id: rawData?.bloodPressureRange.id,
      patientId: rawData?.bloodPressureRange.patientID,
      name: "Blood Pressure",
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
      name: "Blood Sugar",
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
        },
      ],
    },
    {
      id: rawData?.bodyTemperatureRange.id,
      patientId: rawData?.bodyTemperatureRange.patientID,
      name: "Body Temperature",
      ranges: [
        {
          name: "Under Average",
          min: rawData?.bodyTemperatureRange.temperatureUnderAverage,
          max: rawData?.bodyTemperatureRange.temperatureUnderAverage,
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
      name: "Oxygen Saturation",
      ranges: [
        {
          name: "Good",
          min: rawData?.oxygenSaturationRange.oxygenSaturationGood,
          max: rawData?.oxygenSaturationRange.oxygenSaturationGood,
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
        },
      ],
    },
    {
      id: rawData?.bodyWeightRange.id,
      patientId: rawData?.bodyWeightRange.patientID,
      name: "Body Weight",
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

export { transformVitalData };
