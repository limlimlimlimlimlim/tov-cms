'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import FacilityForm from '../../facility-form';
import { getFacilityDetail } from '../../../../../api/facility';
import usePermission from '../../../hooks/usePermission';

export default function FacilityRegister() {
  const { id } = useParams();
  const [facilityData, setFacilityData] = useState();
  const { ready, getFacilityPermissions }: any = usePermission();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const data = await getFacilityDetail(id);
    setFacilityData(data.data);
  }, [id]);

  useEffect(() => {
    if (!ready) return;
    const result = getFacilityPermissions();
    if (!result.update) {
      router.replace('/error/403');
    }
    void fetchData();
  }, [fetchData, getFacilityPermissions, ready, router]);

  return <FacilityForm data={facilityData} />;
}
