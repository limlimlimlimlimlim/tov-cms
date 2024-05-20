export interface Section {
  id?: string;
  path: Position[][];
}

export interface Position {
  x: number;
  y: number;
}
