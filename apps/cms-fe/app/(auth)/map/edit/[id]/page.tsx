'use client';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import MapForm from '../../map-form';
import { getMapDetail } from '../../../../../api/map';
import usePermission from '../../../hooks/usePermission';

export default function MapEdit() {
  const { id } = useParams();
  const [mapData, setMapData] = useState();
  const { ready, getMapPermissions }: any = usePermission();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const data = await getMapDetail(id);
    setMapData(data.data);
  }, [id]);

  useEffect(() => {
    if (!ready) return;
    const result = getMapPermissions();
    if (!result.update) {
      router.replace('/error/403');
    }
    void fetchData();
  }, [fetchData, getMapPermissions, ready, router]);

  return <MapForm data={mapData} />;
}
