'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMapDetail } from '../../../../api/map';
import usePermission from '../../hooks/use-permission';
import { SectionManagementStatus } from '../../../../interface/section';

export const SectionContext = createContext({});

export const SectionProvider = ({ children }) => {
  const { id } = useParams();
  const [mapData, setMapData] = useState<any>();
  const { ready, getMapInfoPermissions }: any = usePermission();
  const router = useRouter();
  const [status, setStatus] = useState<SectionManagementStatus>(
    SectionManagementStatus.View,
  );
  const [canvas, setCanvas] = useState<any>(null);
  const [stage, setStage] = useState<any>(null);

  const fetchData = useCallback(async () => {
    const data = await getMapDetail(id);
    setMapData(data.data);
  }, [id]);

  const clearCanvas = useCallback(() => {
    if (!canvas) return;
    canvas.remove(...canvas.getObjects());
    canvas.renderAll();
  }, [canvas]);

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
        canvas,
        stage,
        mapData,
        status,
        setStatus,
        setCanvas,
        setStage,
        clearCanvas,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
