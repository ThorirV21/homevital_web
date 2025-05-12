export interface TeamPost {
  name: string;
  workerIDs: number[];
  patientIDs: number[];
}

export interface Team {
  id: number;
  name: string;
  teamLeaderID: number;
  teamLeaderName: string;
  workerIDs: number[];
  patientIDs: number[];
}
