export interface TreatmentType {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  patientID: number;
  instructions: string;
  isActive: boolean;
  teamID: number;
  weightMeasurementDays: number[];
  bloodSugarMeasurementDays: number[];
  bloodPressureMeasurementDays: number[];
  oxygenSaturationMeasurementDays: number[];
  bodyTemperatureMeasurementDays: number[];
}

export interface TreatmentPost {
  name: string;
  startDate: string;
  endDate: string;
  patientID: number;
  instructions: string;
  teamID: number;
  weightMeasurementDays: number[];
  bloodSugarMeasurementDays: number[];
  bloodPressureMeasurementDays: number[];
  oxygenSaturationMeasurementDays: number[];
  bodyTemperatureMeasurementDays: number[];
}
