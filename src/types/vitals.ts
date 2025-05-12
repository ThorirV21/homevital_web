export interface SingleRange2 {
  name: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
  prefix?: string;
  rawValue?: string;
}

export interface VitalCategory {
  id: number | string | undefined;
  patientId: number | string | undefined;
  name: string | undefined;
  ranges: SingleRange[];
  distolicRanges?: SingleRange[];
}

export interface RawVitalRanges2 {
  bloodPressureRange: {
    id: number;
    patientID: number;
    diastolicCriticalMax: string;
    diastolicCriticalMin: string;
    diastolicCriticalStage3Max: string;
    diastolicCriticalStage3Min: string;

    diastolicGoodMax: string;
    diastolicNotOkMax: string;
    diastolicNotOkMin: string;
    diastolicOkMax: string;
    diastolicOkMin: string;
    systolicCriticalMax: string;
    systolicCriticalMin: string;
    systolicCriticalStage3Max: string;
    systolicCriticalStage3Min: string;
    systolicGoodMax: string;
    systolicNotOkMax: string;
    systolicNotOkMin: string;
    systolicOkMax: string;
    systolicOkMin: string;
  };
  bloodSugarRange: {
    id: number;
    patientID: number;
    bloodSugarCriticalMax: string;
    bloodSugarCriticalMin: string;
    bloodSugarNotOkMax: string;
    bloodSugarNotOkMin: string;
    bloodSugarGoodMax: string;
    bloodSugarGoodMin: string;
    bloodSugarlowMax: string;
    bloodSugarlowMin: string;
  };
  bodyTemperatureRange: {
    id: number;
    patientID: number;
    temperatureCriticalMax: string;
    temperatureCriticalMin: string;
    temperatureNotOkMax: string;
    temperatureNotOkMin: string;
    temperatureGoodMax: string;
    temperatureGoodMin: string;
    temperatureUnderAverage: string;
  };
  bodyWeightRange: {
    id: number;
    patientID: number;
    weightGainFluctuationPercentageGood: string;
    weightGainPercentageGoodMax: string;
    weightLossFluctuationPercentageGood: string;
  };
  oxygenSaturationRange: {
    id: number;
    patientID: number;
    oxygenSaturationCriticalMax: string;
    oxygenSaturationCriticalMin: string;
    oxygenSaturationNotOkMax: string;
    oxygenSaturationNotOkMin: string;
    oxygenSaturationOkMax: string;
    oxygenSaturationOkMin: string;
    oxygenSaturationGood: string;
  };
}

export type VitalTransformKey =
  | "bodytemperature"
  | "bloodpressure"
  | "bloodsugar"
  | "oxygensaturation"
  | "bodyweight";

export type VitalPatch = {
  clientId: number;
  id: number;
  data: SingleRange[];
  type: string;
  distolicRanges?: SingleRange[];
};

export type vitalSettings = {
  name: string;
  data: string;
  texts: string[];
  colors: string[];
  type: string;
  min: number;
  max: number;
};

// New vital range types
export type BodyTemperatureRange = {
  id: number;
  patientID: number;
  temperatureUnderAverage: number;
  temperatureGood: number;
  temperatureNotOk: number;
  temperatureCritical: number;
};

export type BloodPressureRange = {
  id: number;
  patientID: number;
  systolicLowered: number;
  systolicGood: number;
  systolicRaised: number;
  systolicHigh: number;
  diastolicLowered: number;
  diastolicGood: number;
  diastolicRaised: number;
  diastolicHigh: number;
};

export type BloodSugarRange = {
  id: number;
  patientID: number;
  bloodSugarLowered: number;
  bloodSugarGood: number;
  bloodSugarRaised: number;
  bloodSugarHigh: number;
};

export type BodyWeightRange = {
  id: number;
  patientID: number;
  weightLossFluctuationPercentageGood: number;
  weightGainPercentageGoodMax: number;
  weightGainFluctuationPercentageGood: number;
};

export type OxygenSaturationRange = {
  id: number;
  patientID: number;
  oxygenSaturationGood: number;
  oxygenSaturationRaised: number;
  oxygenSaturationHigh: number;
};

export type RawVitalRanges = {
  bodyTemperatureRange: BodyTemperatureRange;
  bloodPressureRange: BloodPressureRange;
  bloodSugarRange: BloodSugarRange;
  bodyWeightRange: BodyWeightRange;
  oxygenSaturationRange: OxygenSaturationRange;
};

export type VitalType =
  | BodyTemperatureRange
  | BloodPressureRange
  | BloodSugarRange
  | BodyWeightRange
  | OxygenSaturationRange;

export type SingleRange = {
  name: string;
  prefix: string;
  displayText: string;
  [key: string]: number | string | undefined;
};

export interface FixedRange {
  id: number | undefined;
  patientID: number | undefined;
  name: string;
  unit: string;
  ranges: SingleRange[];
}
