'use client';
import { useParams } from 'next/navigation';
import MapForm from '../../map-form';
import { getMapDetail } from '../../../../api/map';
import { useEffect, useState } from 'react';

export default function MapEdit() {
  const { id } = useParams();
  const [mapData, setMapData] = useState();

  const fetchData = async () => {
    const data = await getMapDetail(id);
    setMapData(data.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <MapForm data={mapData} />;
}
