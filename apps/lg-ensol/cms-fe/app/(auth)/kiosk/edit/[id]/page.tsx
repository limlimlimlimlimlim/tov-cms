'use client';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import KioskForm from '../../kiosk-form';
import { getKioskDetail } from '../../../../../api/kiosk';
import usePermission from '../../../hooks/use-permission';

export default function KioskEdit() {
  const { id } = useParams();
  const [kioskData, setKioskData] = useState();
  const { ready, getKioskPermissions }: any = usePermission();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const data = await getKioskDetail(id);
    setKioskData(data.data);
  }, [id]);

  useEffect(() => {
    if (!ready) return;
    const result = getKioskPermissions();
    if (!result.update) {
      router.replace('/error/403');
    }
    void fetchData();
  }, [fetchData, getKioskPermissions, ready, router]);

  return <KioskForm data={kioskData} />;
}
