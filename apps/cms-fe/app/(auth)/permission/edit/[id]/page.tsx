'use client';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PermissionForm from '../../permission-form';
import { getPermissionDetail } from '../../../../../api/permission';

export default function PermissionEdit() {
  const { id } = useParams();
  const [permissionData, setPermissionData] = useState();

  const fetchData = useCallback(async () => {
    const data = await getPermissionDetail(id);
    setPermissionData(data.data);
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return <PermissionForm data={permissionData} />;
}
