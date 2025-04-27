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

export type PatientMeasurement = {
  id: number;
  uid: number;
  measurementType: string;
  measurementDate: string;
  measurementValues: SingleMeasurement;
};

export type WorkerDTO = {
  id: number;
  name: string;
  phone: string;
  teamIDs: number[];
  status: string;
  ssn: string;
};
export type SingleMeasurement = {
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
};
