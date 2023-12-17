'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import usePermission from '../../hooks/usePermission';
import PermissionForm from '../permission-form';

export default function PermissionRegister() {
  const { ready, getPermissionPermissions }: any = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const result = getPermissionPermissions();
    if (!result.write) {
      router.replace('/error/403');
    }
  }, [getPermissionPermissions, ready, router]);
  return <PermissionForm data={null} />;
}
