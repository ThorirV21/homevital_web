export type BodyTemperatureRange = {
  id: number;
  patientID: number;
  bodyTemperatureGoodMin?: number;
  bodyTemperatureGoodMax?: number;
  bodyTemperatureUnderAverage?: number;
  bodyTemperatureNotOkMin?: number;
  bodyTemperatureNotOkMax?: number;
  bodyTemperatureCriticalMin?: number;
  bodyTemperatureCriticalMax?: number;
};

export type BloodPressureRange = {
  id: number;
  patientID: number;
  systolicGoodMax?: number;
  diastolicGoodMax?: number;
  systolicOkMin?: number;
  systolicOkMax?: number;
  diastolicOkMin?: number;
  diastolicOkMax?: number;
  systolicNotOkMin?: number;
  systolicNotOkMax?: number;
  diastolicNotOkMin?: number;
  diastolicNotOkMax?: number;
  systolicCriticalMin?: number;
  systolicCriticalMax?: number;
  diastolicCriticalMin?: number;
  diastolicCriticalMax?: number;
  systolicCriticalStage3Min?: number;
  systolicCriticalStage3Max?: number;
  diastolicCriticalStage3Min?: number;
  diastolicCriticalStage3Max?: number;
};

export type BloodSugarRange = {
  id: number;
  patientID: number;
  bloodSugarGoodMin?: number;
  bloodSugarGoodMax?: number;
  bloodSugarNotOkMin?: number;
  bloodSugarNotOkMax?: number;
  bloodSugarCriticalMin?: number;
  bloodSugarCriticalMax?: number;
  bloodSugarlowMin?: number;
  bloodSugarlowMax?: number;
};

export type OxygenSaturationRange = {
  id: number;
  patientID: number;
  oxygenSaturationGood?: number;
  oxygenSaturationOkMin?: number;
  oxygenSaturationOkMax?: number;
  oxygenSaturationNotOkMin?: number;
  oxygenSaturationNotOkMax?: number;
  oxygenSaturationCriticalMin?: number;
  oxygenSaturationCriticalMax?: number;
  oxygenSaturationlowMin?: number;
  oxygenSaturationlowMax?: number;
};

export type BodyWeightRange = {
  id: number;
  patientID: number;
  weightGainPercentageGoodMax?: number;
  weightLossPercentageGoodMax?: number;
  weightGainFluctuationPercentageGood?: number;
  weightLossFluctuationPercentageGood?: number;
  weightGainFluctuationPercentageCriticalMin?: number;
  weightLossFluctuationPercentageCriticalMax?: number;
};
