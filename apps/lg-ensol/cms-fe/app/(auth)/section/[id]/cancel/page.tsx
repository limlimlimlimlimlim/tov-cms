'use client';

import { Button, message } from 'antd';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import { cancelFacility, getSectionsByMapId } from '../../../../../api/section';
import { convertToKonvaOptions } from '../utils/utils';
import CancelableSectionManager from '../classes/cancelable-section-manger';
import useFaciltyInfo from '../hooks/use-facility-info';

declare const Konva: any;

const SectionCancelStatePage = () => {
  const router = useRouter();
  const { mapData, stage } = useContext<any>(SectionContext);
  const { addSection } = useFaciltyInfo();

  const cancelableSectionManager = useMemo(() => {
    if (!stage) return;
    return new CancelableSectionManager(stage);
  }, [stage]);

  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  const onClickSave = async () => {
    if (!cancelableSectionManager) return;
    const requests = Array.from(cancelableSectionManager.cancelSections).map(
      ([key]: [number]) => {
        return cancelFacility(key);
      },
    );

    await Promise.all(requests);
    message.success('위치 설정이 해제 됐습니다.');
    router.replace(`/section/${mapData.id}/view`);
  };

  const fetchSection = useCallback(
    async (id) => {
      if (!cancelableSectionManager) return;
      const response = await getSectionsByMapId(id);
      response.data.forEach((d) => {
        const section = cancelableSectionManager.addSection(
          d.path,
          d.id,
          convertToKonvaOptions(d),
          d.facilities[0],
        );

        addSection(section);
      });

      cancelableSectionManager.layer.moveToTop();
    },
    [addSection, cancelableSectionManager],
  );

  useEffect(() => {
    if (!mapData) return;
    if (!stage) return;
    if (!cancelableSectionManager) return;
    stage.add(layer);
    fetchSection(mapData.id);
  }, [
    cancelableSectionManager,
    fetchSection,
    layer,
    mapData,
    mapData.id,
    stage,
  ]);

  useEffect(() => {
    return () => {
      if (!cancelableSectionManager) return;
      cancelableSectionManager.destroy();
      layer.destroy();
      layer.remove();
    };
  }, [cancelableSectionManager, layer, stage]);

  return (
    <>
      <Button onClick={onClickSave}>저장</Button>
      <Button>
        <Link href={`/section/${mapData.id}/view`}>취소</Link>
      </Button>
    </>
  );
};

export default SectionCancelStatePage;
