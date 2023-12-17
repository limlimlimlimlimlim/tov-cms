'use client';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import KioskForm from '../../kiosk-form';
import { getKioskDetail } from '../../../../../api/kiosk';

export default function KioskEdit() {
  const { id } = useParams();
  const [kioskData, setKioskData] = useState();

  const fetchData = useCallback(async () => {
    const data = await getKioskDetail(id);
    setKioskData(data.data);
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return <KioskForm data={kioskData} />;
}
