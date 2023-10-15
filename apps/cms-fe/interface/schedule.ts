export interface ScheduleItem {
  key: React.Key;
  no: number;
  kiosk: string;
  name: string;
  type: string;
  status: string;
  startDate: Date;
  endDate: Date;
  order: number;
  createDate: Date;
  modifiedDate: Date;
}
