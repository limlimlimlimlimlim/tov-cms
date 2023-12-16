export interface AccountItem {
  key: React.Key;
  id: number;
  name: string;
  userId: string;
  description: string;
  permissionId: string;
  facilityCategoryId: string;
  facilitySubCategoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
