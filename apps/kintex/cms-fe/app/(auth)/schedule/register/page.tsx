'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import usePermission from '../../hooks/use-permission';
import ScheduleForm from '../schedule-form';

export default function ScheduleRegister() {
  const { ready, getSchedulePermissions }: any = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const result = getSchedulePermissions();
    if (!result.write) {
      router.replace('/error/403');
    }
  }, [getSchedulePermissions, ready, router]);

  return <ScheduleForm data={null} />;
}
