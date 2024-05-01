'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getMapDetail } from '../../../../../api/map';
import usePermission from '../../../hooks/use-permission';
import SectionForm from './section-form';

export default function SectionEdit() {
  const { id } = useParams();
  const [mapData, setMapData] = useState();
  const { ready, getMapInfoPermissions }: any = usePermission();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const data = await getMapDetail(id);
    setMapData(data.data);
  }, [id]);

  useEffect(() => {
    if (!ready) return;
    const result = getMapInfoPermissions();
    if (!result.update) {
      router.replace('/error/403');
    }
    void fetchData();
  }, [fetchData, getMapInfoPermissions, ready, router]);

  return <SectionForm data={mapData} />;
}
