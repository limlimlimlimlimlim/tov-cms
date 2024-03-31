'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getPermissionDetail } from '../../../api/permission';

const usePermission = () => {
  const [ready, setReady] = useState(false);
  const [permission, setPermission] = useState<any>({});
  const router = useRouter();

  const fetchPermission = useCallback(async () => {
    const permissionId = localStorage.getItem('cms-user-permission-id');
    if (!permissionId) {
      router.replace('/login');
      return;
    }
    const result = await getPermissionDetail(permissionId);
    setPermission(result.data);
    setReady(true);
  }, [router]);

  useEffect(() => {
    void fetchPermission();
  }, [fetchPermission]);

  const getAccountPermissions = useCallback(() => {
    return {
      read: permission.readAccount,
      write: permission.writeAccount,
      delete: permission.deleteAccount,
      update: permission.editAccount,
    };
  }, [permission]);

  const getPermissionPermissions = useCallback(() => {
    return {
      read: permission.readPermission,
      write: permission.writePermission,
      delete: permission.deletePermission,
      update: permission.editPermission,
    };
  }, [permission]);

  const getSchedulePermissions = useCallback(() => {
    return {
      read: permission.readSchedule,
      write: permission.writeSchedule,
      delete: permission.deleteSchedule,
      update: permission.editSchedule,
    };
  }, [permission]);

  const getPostPermissions = useCallback(() => {
    return {
      read: permission.readPost,
      write: permission.writePost,
      delete: permission.deletePost,
      update: permission.editPost,
    };
  }, [permission]);

  const getMapPermissions = useCallback(() => {
    return {
      read: permission.readMap,
      write: permission.writeMap,
      delete: permission.deleteMap,
      update: permission.editMap,
    };
  }, [permission]);

  const getMapInfoPermissions = useCallback(() => {
    return {
      read: permission.readMapInfo,
      write: permission.writeMapInfo,
      delete: permission.deleteMapInfo,
      update: permission.editMapInfo,
    };
  }, [permission]);

  const getFacilityPermissions = useCallback(() => {
    return {
      read: permission.readFacility,
      write: permission.writeFacility,
      delete: permission.deleteFacility,
      update: permission.editFacility,
    };
  }, [permission]);

  const getKioskPermissions = useCallback(() => {
    return {
      read: permission.readKiosk,
      write: permission.writeKiosk,
      delete: permission.deleteKiosk,
      update: permission.editKiosk,
    };
  }, [permission]);

  return {
    ready,
    getAccountPermissions,
    getPermissionPermissions,
    getSchedulePermissions,
    getPostPermissions,
    getMapPermissions,
    getMapInfoPermissions,
    getFacilityPermissions,
    getKioskPermissions,
  };
};

export default usePermission;
