'use client';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getMapDetail } from '../../../../../api/map';
import MapInfoForm from './map-info-form';

export default function MapInfoEdit() {
  const { id } = useParams();
  const [mapData, setMapData] = useState();

  const fetchData = useCallback(async () => {
    const data = await getMapDetail(id);
    setMapData(data.data);
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return <MapInfoForm data={mapData} />;
}
