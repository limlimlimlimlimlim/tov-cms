'use client';

import { Button, message } from 'antd';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import { addSection, getSectionsByMapId } from '../../../../../api/section';
import Section from '../classes/section';
import GuideSection from '../classes/guide-section';
import EditableSectionManager from '../classes/editable-section-manger';
import { convertToKonvaOptions } from '../utils/utils';
import useFaciltyInfo from '../hooks/use-facility-info';

declare const Konva: any;

const SectionAddStatePage = () => {
  const router = useRouter();
  const { mapData, stage } = useContext<any>(SectionContext);
  const sections = useRef([]);
  const { addSection: addFacilityInfoSection } = useFaciltyInfo();

  const guideSection = useMemo(() => {
    if (!stage) return;
    return new GuideSection(stage);
  }, [stage]);

  const editableSectionManager = useMemo(() => {
    if (!stage) return;
    return new EditableSectionManager(stage);
  }, [stage]);

  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  const onClickSave = async () => {
    if (!editableSectionManager) return;
    const requests = editableSectionManager.sections.map((s) => {
      return addSection(mapData.id, s.toArrayPath().join());
    });
    await Promise.all(requests);
    message.success('구역이 추가 됐습니다.');
    router.replace(`/section/${mapData.id}/view`);
  };

  const fetchSection = useCallback(
    async (id) => {
      if (!guideSection) return;
      if (!editableSectionManager) return;
      const response = await getSectionsByMapId(id);
      sections.current = response.data.map((data) => {
        const sec = new Section(
          layer,
          data.path,
          convertToKonvaOptions(data),
          data.id,
        );
        if (data.facilities[0]) {
          sec.setFacility(data.facilities[0]);
          addFacilityInfoSection(sec);
        }

        return sec;
      });

      editableSectionManager.layer.moveToTop();
      guideSection.layer.moveToTop();
    },
    [addFacilityInfoSection, editableSectionManager, guideSection, layer],
  );

  useEffect(() => {
    if (!mapData) return;
    if (!stage) return;
    if (!guideSection) return;
    if (!editableSectionManager) return;
    stage.add(layer);
    fetchSection(mapData.id);
    guideSection.on('complete', (path) => {
      editableSectionManager.addSection(path);
    });
  }, [
    editableSectionManager,
    fetchSection,
    guideSection,
    layer,
    mapData,
    stage,
  ]);

  useEffect(() => {
    return () => {
      if (!guideSection) return;
      if (!editableSectionManager) return;
      guideSection.destroy();
      editableSectionManager.destroy();
      sections.current.forEach((s: Section) => s.destroy());
      layer.remove();
      layer.destroy();
    };
  }, [editableSectionManager, guideSection, layer, stage]);

  return (
    <>
      <Button onClick={onClickSave}>저장</Button>

      <Link href={`/section/${mapData.id}/view`} style={{ lineHeight: 0 }}>
        <Button>취소</Button>
      </Link>
    </>
  );
};

export default SectionAddStatePage;
