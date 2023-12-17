'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import usePermission from '../../hooks/usePermission';
import KioskForm from '../kiosk-form';

export default function KioskRegister() {
  const { ready, getKioskPermissions }: any = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const result = getKioskPermissions();
    if (!result.write) {
      router.replace('/error/403');
    }
  }, [getKioskPermissions, ready, router]);

  return <KioskForm data={null} />;
}
