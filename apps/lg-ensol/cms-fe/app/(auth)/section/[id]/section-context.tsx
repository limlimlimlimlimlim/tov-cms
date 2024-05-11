'use client';

import { createContext, useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getMapDetail } from '../../../../api/map';
import usePermission from '../../hooks/use-permission';
import type { Section } from '../../../../interface/section';
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
  const [newSections, setNewSections] = useState<Section[]>([]);

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

  const addNewSection = (s: Section) => {
    setNewSections([...newSections, s]);
  };

  return (
    <SectionContext.Provider
      value={{ newSections, mapData, status, setStatus, addNewSection }}
    >
      {children}
    </SectionContext.Provider>
  );
};
