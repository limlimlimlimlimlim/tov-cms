'use client';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import MapForm from '../../map-form';
import { getMapDetail } from '../../../../api/map';

export default function MapEdit() {
  const { id } = useParams();
  const [mapData, setMapData] = useState();

  const fetchData = useCallback(async () => {
    const data = await getMapDetail(id);
    setMapData(data.data);
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return <MapForm data={mapData} />;
}
