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

declare const Konva: any;

const SectionAddStatePage = () => {
  const router = useRouter();
  const { mapData, stage } = useContext<any>(SectionContext);
  const sections = useRef([]);

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
      sections.current = response.data.map(
        (data) => new Section(layer, data.path),
      );
      editableSectionManager.layer.moveToTop();
      guideSection.layer.moveToTop();
    },
    [editableSectionManager, guideSection, layer],
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
      <Button size="small" onClick={onClickSave}>
        저장
      </Button>
      <Button size="small">
        <Link href={`/section/${mapData.id}/view`}>취소</Link>
      </Button>
    </>
  );
};

export default SectionAddStatePage;
