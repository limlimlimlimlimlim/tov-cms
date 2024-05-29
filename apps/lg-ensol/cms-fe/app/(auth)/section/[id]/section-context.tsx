'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMapDetail } from '../../../../api/map';
import usePermission from '../../hooks/use-permission';

export const SectionContext = createContext({});

export const SectionProvider = ({ children }) => {
  const router = useRouter();
  const { id } = useParams();
  const [mapData, setMapData] = useState<any>();
  const { ready, getMapInfoPermissions }: any = usePermission();
  const [stage, setStage] = useState<any>(null);
  const [hoverFacility, setHoverFacility] = useState();
  const [selectedFacility, setSelectedFacility] = useState();

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

  return (
    <SectionContext.Provider
      value={{
        stage,
        mapData,
        hoverFacility,
        selectedFacility,
        setStage,
        setHoverFacility,
        setSelectedFacility,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
