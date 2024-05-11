export enum SectionManagementStatus {
  View,
  Add,
}

export interface Section {
  // id: string;
  path: { x: number; y: number }[][];
}
