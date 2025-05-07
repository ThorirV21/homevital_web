export interface RawClient {
  data: Client[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  status: string;
  address: string;
  teamID: number;
  kennitala: string;
}

export interface MeasurementValue {
  systolic: number;
  diastolic: number;
  bpm: number;
  measureHand: string;
  bodyPosition: string;
  bloodSugar: number;
  weight: number;
  temperature: number;
  oxygenSaturation: number;
  status: string;
}

export interface ClientMeasurements {
  uid: number;
  id: number;
  measurementType: string;
  measurementDate: string;
  measurementValues: MeasurementValue[];
}

export interface RawWarning {
  data: WarningList[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
}

export interface WarningList {
  uid: number;
  id: number;
  patientID: number;
  measurementType: string;
  measurementDate: string;
  measurementValues: MeasurementValue;
}
