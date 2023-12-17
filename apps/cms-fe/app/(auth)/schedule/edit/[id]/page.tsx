'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ScheduleForm from '../../schedule-form';
import { getScheduleDetail } from '../../../../../api/schedule';
import usePermission from '../../../hooks/usePermission';

export default function ScheduleEdit() {
  const { id } = useParams();
  const [scheduleData, setScheduleData] = useState();
  const { ready, getSchedulePermissions }: any = usePermission();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const data = await getScheduleDetail(id);
    setScheduleData(data.data);
  }, [id]);

  useEffect(() => {
    if (!ready) return;
    const result = getSchedulePermissions();
    if (!result.update) {
      router.replace('/error/403');
    }
    void fetchData();
  }, [fetchData, getSchedulePermissions, ready, router]);

  return <ScheduleForm data={scheduleData} />;
}
