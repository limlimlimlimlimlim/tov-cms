export interface FacilityItem {
  key: React.Key;
  id: number;
  wing: string;
  floor: string;
  name: string;
  type: string;
  detailType: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FacilityDesign {
  fontSize: number;
  paddingTop: number;
  paddingBottom: number;
  paddingRight: number;
  paddingLeft: number;
  iconColor: string;
  tooltipColor: string;
}
