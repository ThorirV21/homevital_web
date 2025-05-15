interface navProps {
  title: string;
  link: string;
}

interface clientListProps {
  id: number;
  name: string;
  address: string;
  team: string;
  status_Logo: string;
}

export type { navProps, clientListProps };

export type BloodPressure = {
  id: number;
  patientID: number;
  measureHand: string;
  bodyPosition: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  date: string;
  status: string;
};

export type BloodSugar = {
  id: number;
  patientID: number;
  bloodsugarLevel: number;
  date: string;
};

export type BodyWeight = {
  id: number;
  patientID: number;
  weight: number;
  date: string;
};

export type BodyTemperature = {
  id: number;
  patientID: number;
  temperature: number;
  date: string;
};

export interface RawPatientMeasurements {
  data: PatientMeasurement[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
}

export type PatientMeasurement = {
  isAcknowledged: boolean;
  id: number;
  uid: number;
  measurementType: string;
  measurementDate: string;
  measurementValues: SingleMeasurement;
  resolutionNotes: string;
};

export type RawWorker = {
  data: WorkerDTO[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
};

export type WorkerDTO = {
  id: number;
  name: string;
  phone: string;
  teamIDs: number[];
  status: string;
  kennitala: string;
};
export type SingleMeasurement = {
  resolutionNotes: string;
  isAcknowledged: boolean;
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
};

export interface RawPatientMeasurements {
  data: PatientMeasurement[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
}
