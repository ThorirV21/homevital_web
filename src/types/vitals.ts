export interface SingleRange {
  name: string | undefined;
  min: number | undefined;
  max: number | undefined;
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
    diastolicCriticalMax: number;
    diastolicCriticalMin: number;
    diastolicCriticalStage3Max: number;
    diastolicCriticalStage3Min: number;
    diastolicGood: number;
    diastolicNotOkMax: number;
    diastolicNotOkMin: number;
    diastolicOkMax: number;
    diastolicOkMin: number;
    systolicCriticalMax: number;
    systolicCriticalMin: number;
    systolicCriticalStage3Max: number;
    systolicCriticalStage3Min: number;
    systolicGood: number;
    systolicNotOkMax: number;
    systolicNotOkMin: number;
    systolicOkMax: number;
    systolicOkMin: number;
  };
  bloodSugarRange: {
    id: number;
    patientID: number;
    bloodSugarCriticalMax: number;
    bloodSugarCriticalMin: number;
    bloodSugarNotOkMax: number;
    bloodSugarNotOkMin: number;
    bloodSugarGoodMax: number;
    bloodSugarGoodMin: number;
    bloodSugarlowMax: number;
    bloodSugarlowMin: number;
  };
  bodyTemperatureRange: {
    id: number;
    patientID: number;
    temperatureCriticalMax: number;
    temperatureCriticalMin: number;
    temperatureNotOkMax: number;
    temperatureNotOkMin: number;
    temperatureGoodMax: number;
    temperatureGoodMin: number;
    temperatureUnderAverage: number;
  };
  bodyWeightRange: {
    id: number;
    patientID: number;
    weightGainFluctuationPercentageGood: number;
    weightGainPercentageGoodMax: number;
    weightLossFluctuationPercentageGood: number;
  };
  oxygenSaturationRange: {
    id: number;
    patientID: number;
    oxygenSaturationCriticalMax: number;
    oxygenSaturationCriticalMin: number;
    oxygenSaturationNotOkMax: number;
    oxygenSaturationNotOkMin: number;
    oxygenSaturationOkMax: number;
    oxygenSaturationOkMin: number;
    oxygenSaturationGood: number;
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
