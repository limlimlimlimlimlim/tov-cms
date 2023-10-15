export interface AccountItem {
  key: React.Key;
  no: number;
  name: string;
  id: string;
  permission: string;
  createDate: Date;
  modifiedDate: Date;
}

export interface PermissionItem {
  key: React.Key;
  no: number;
  name: string;
  description: string;
  modifiedDate: Date;
}
