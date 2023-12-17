'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import usePermission from '../../hooks/usePermission';
import AccountForm from '../account-form';

export default function AccountRegister() {
  const { ready, getAccountPermissions }: any = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const result = getAccountPermissions();
    if (!result.write) {
      router.replace('/error/403');
    }
  }, [getAccountPermissions, ready, router]);

  return <AccountForm data={null} />;
}
