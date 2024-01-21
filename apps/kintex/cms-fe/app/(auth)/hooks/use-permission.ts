'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getPermissionDetail } from '../../../api/permission';

const usePermission = () => {
  const [ready, setReady] = useState(true);
  const [permission, setPermission] = useState<any>({});
  const router = useRouter();

  const fetchPermission = useCallback(async () => {
    console.log('fetchPermission');
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
    // void fetchPermission();
  }, [fetchPermission]);

  const getAccountPermissions = useCallback(() => {
    return {
      read: true,
      write: true,
      delete: true,
      update: true,
    };
  }, []);

  const getPermissionPermissions = useCallback(() => {
    return {
      read: true,
      write: true,
      delete: true,
      update: true,
    };
  }, []);

  const getSchedulePermissions = useCallback(() => {
    return {
      read: true,
      write: true,
      delete: true,
      update: true,
    };
  }, []);

  const getPostPermissions = useCallback(() => {
    return {
      read: true,
      write: true,
      delete: true,
      update: true,
    };
  }, []);

  const getMapPermissions = useCallback(() => {
    return {
      read: true,
      write: true,
      delete: true,
      update: true,
    };
  }, []);

  const getMapInfoPermissions = useCallback(() => {
    return {
      read: true,
      write: true,
      delete: true,
      update: true,
    };
  }, []);

  const getFacilityPermissions = useCallback(() => {
    return {
      read: true,
      write: true,
      delete: true,
      update: true,
    };
  }, []);

  const getKioskPermissions = useCallback(() => {
    return {
      read: true,
      write: true,
      delete: true,
      update: true,
    };
  }, []);

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
