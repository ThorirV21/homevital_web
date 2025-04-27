export interface Client {
  id: number;
  name: string;
  phone: string;
  status: string;
  address: string;
  teamID: number;
  ssn: string;
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
