export enum SectionManagementStatus {
  View,
  Add,
}

export interface Section {
  // id: string;
  path: Position[][];
}

export interface Position {
  x: number;
  y: number;
}
