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
  const [addFacilityTargetSection, setAddFacilityTargetSection] = useState();
  const [isOpenFacilityContainer, setIsOpenFacilityContainer] = useState(false);
  const [facilityDetailId, setFacilityDetailId] = useState<string>();

  const fetchData = useCallback(async () => {
    const data = await getMapDetail(id);
    setMapData(data.data);
  }, [id]);

  const openFacilityContainer = useCallback(() => {
    setIsOpenFacilityContainer(true);
  }, []);

  const closeFacilityContainer = useCallback(() => {
    setIsOpenFacilityContainer(false);
  }, []);

  const addFacility = useCallback(
    (sectionId) => {
      setAddFacilityTargetSection(sectionId);
      openFacilityContainer();
    },
    [openFacilityContainer],
  );

  const showFacilityDetail = useCallback((facilityId: string) => {
    setFacilityDetailId(facilityId);
  }, []);

  const hideFacilityDetail = useCallback(() => {
    setFacilityDetailId('');
  }, []);

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
        addFacilityTargetSection,
        isOpenFacilityContainer,
        facilityDetailId,
        setStage,
        setHoverFacility,
        addFacility,
        openFacilityContainer,
        closeFacilityContainer,
        showFacilityDetail,
        hideFacilityDetail,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
};
