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
  measuredHand: string;
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
  patientID: number;
  measurementType: string;
  measurementDate: string;
  measurementValues: MeasurementValue[];
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface RawWarning {
  data: WarningList[];
  meta?: PaginationMeta;
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
