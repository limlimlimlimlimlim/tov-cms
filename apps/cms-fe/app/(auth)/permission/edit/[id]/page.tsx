'use client';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PermissionForm from '../../permission-form';
import { getPermissionDetail } from '../../../../../api/permission';
import usePermission from '../../../hooks/usePermission';

export default function PermissionEdit() {
  const { id } = useParams();
  const [permissionData, setPermissionData] = useState();
  const { ready, getPermissionPermissions }: any = usePermission();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const data = await getPermissionDetail(id);
    setPermissionData(data.data);
  }, [id]);

  useEffect(() => {
    if (!ready) return;
    const result = getPermissionPermissions();
    if (!result.update) {
      router.replace('/error/403');
    }
    void fetchData();
  }, [fetchData, getPermissionPermissions, ready, router]);

  return <PermissionForm data={permissionData} />;
}
