'use client';

import { Button, message } from 'antd';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import {
  getSectionsByMapId,
  updateSectionById,
} from '../../../../../api/section';
import EditableSectionManager from '../classes/editable-section-manger';
import type Section from '../classes/section';
import { convertToKonvaOptions } from '../utils/utils';
import useFaciltyInfo from '../hooks/use-facility-info';

declare const Konva: any;

const SectionEditStatePage = () => {
  const router = useRouter();
  const { mapData, stage } = useContext<any>(SectionContext);
  const { addSection } = useFaciltyInfo();
  const editableSectionManager = useMemo(() => {
    if (!stage) return;
    return new EditableSectionManager(stage);
  }, [stage]);

  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  const onClickSave = async () => {
    if (!editableSectionManager) return;
    const requests = Array.from(editableSectionManager.editSections).map(
      ([key, value]: [number, Section]) => {
        return updateSectionById(key, mapData.id, value.toArrayPath().join());
      },
    );

    await Promise.all(requests);
    message.success('구역이 수정 됐습니다.');
    router.replace(`/section/${mapData.id}/view`);
  };

  const fetchSection = useCallback(
    async (id) => {
      if (!editableSectionManager) return;
      const response = await getSectionsByMapId(id);
      response.data.forEach((d) => {
        const sec = editableSectionManager.addSection(
          d.path,
          d.id,
          convertToKonvaOptions(d),
          d.facilities[0],
        );
        addSection(sec);
      });
      editableSectionManager.layer.moveToTop();
    },
    [addSection, editableSectionManager],
  );

  useEffect(() => {
    if (!mapData) return;
    if (!stage) return;
    if (!editableSectionManager) return;
    stage.add(layer);
    fetchSection(mapData.id);
  }, [editableSectionManager, fetchSection, layer, mapData, mapData.id, stage]);

  useEffect(() => {
    return () => {
      if (!editableSectionManager) return;
      editableSectionManager.destroy();
      layer.destroy();
      layer.remove();
    };
  }, [editableSectionManager, layer, stage]);

  return (
    <>
      <Button onClick={onClickSave}>저장</Button>
      <Button>
        <Link href={`/section/${mapData.id}/view`}>취소</Link>
      </Button>
    </>
  );
};

export default SectionEditStatePage;
