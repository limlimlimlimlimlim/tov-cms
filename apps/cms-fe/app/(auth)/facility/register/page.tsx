'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import usePermission from '../../hooks/usePermission';
import FacilityForm from '../facility-form';

export default function FacilityRegister() {
  const { ready, getFacilityPermissions }: any = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const result = getFacilityPermissions();
    if (!result.write) {
      router.replace('/error/403');
    }
  }, [getFacilityPermissions, ready, router]);

  return <FacilityForm data={null} />;
}
