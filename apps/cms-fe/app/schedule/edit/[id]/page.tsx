'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ScheduleForm from '../../schedule-form';
import { getScheduleDetail } from '../../../../api/schedule';

export default function ScheduleEdit() {
  const { id } = useParams();
  const [scheduleData, setScheduleData] = useState();

  const fetchData = useCallback(async () => {
    const data = await getScheduleDetail(id);
    setScheduleData(data.data);
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);
  return <ScheduleForm data={scheduleData} />;
}
