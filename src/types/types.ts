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
  patientID: number;
  bloodPressure: BloodPressure[];
  bloodSugar: BloodSugar[];
  bodyWeight: BodyWeight[];
  bodyTemperature: BodyTemperature[];
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
};

export type AllMeasurements = {
  id: number;
  measurementID: number;
  measurementType: string;
  measurementValues: [SingleMeasurement];
  measurementDate: string;
};

export type MeasurementTypes = {
  id: number;
  patientID: number;
  measurements: [AllMeasurements];
};
