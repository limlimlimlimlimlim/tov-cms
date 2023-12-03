'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import FacilityForm from '../../facility-form';
import { getFacilityDetail } from '../../../../api/facility';

export default function FacilityRegister() {
  const { id } = useParams();
  const [facilityData, setFacilityData] = useState();

  const fetchData = useCallback(async () => {
    const data = await getFacilityDetail(id);
    setFacilityData(data.data);
  }, [id]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return <FacilityForm data={facilityData} />;
}
