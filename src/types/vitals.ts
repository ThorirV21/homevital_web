export interface SingleRange {
  name: string | undefined;
  min: string | undefined;
  max: string | undefined;
}

export interface VitalCategory {
  id: number | string | undefined;
  patientId: number | string | undefined;
  name: string | undefined;
  ranges: SingleRange[];
  distolicRanges?: SingleRange[];
}

export interface VitalCategoryPressure {
  id: number | string | undefined;
  patientId: number | string | undefined;
  name: string | undefined;
  ranges: SingleRange[];
  distolicRanges?: SingleRange[];
}

export interface RawVitalRanges {
  bloodPressureRange: {
    id: number;
    patientID: number;
    diastolicCriticalMax: string;
    diastolicCriticalMin: string;
    diastolicCriticalStage3Max: string;
    diastolicCriticalStage3Min: string;
    diastolicGood: string;
    diastolicNotOkMax: string;
    diastolicNotOkMin: string;
    diastolicOkMax: string;
    diastolicOkMin: string;
    systolicCriticalMax: string;
    systolicCriticalMin: string;
    systolicCriticalStage3Max: string;
    systolicCriticalStage3Min: string;
    systolicGood: string;
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

export type vitalSettings = {
  name: string;
  data: string;
  texts: string[];
  colors: string[];
  type: string;
  min: number;
  max: number;
};
