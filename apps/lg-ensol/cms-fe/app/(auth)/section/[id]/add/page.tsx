'use client';

import { Button, message } from 'antd';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import { getSectionsByMapId } from '../../../../../api/section';
import Section from '../classes/section';
import GuideSection from '../classes/guide-section';

declare const Konva: any;

const SectionAddStatePage = () => {
  const router = useRouter();
  const { mapData, stage } = useContext<any>(SectionContext);
  const sections = useRef([]);

  const guideSection = useMemo(() => {
    if (!stage) return;
    return new GuideSection(stage);
  }, [stage]);

  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  // useGuideSectionPolygon();
  // useTargetSectionPolygon();

  const onClickSave = async () => {
    // const requests = newSections.map((s) => {
    //   return addSection(
    //     mapData.id,
    //     s.path
    //       .map((p: any) => [p.x, p.y])
    //       .flat()
    //       .join(),
    //   );
    // });
    // await Promise.all(requests);
    message.success('구역이 추가 됐습니다.');
    router.replace(`/section/${mapData.id}/view`);
  };

  const fetchSection = useCallback(
    async (id) => {
      const response = await getSectionsByMapId(id);
      sections.current = response.data.map(
        (data) => new Section(layer, data.path),
      );
      guideSection?.layer.moveToTop();
    },
    [guideSection?.layer, layer],
  );

  useEffect(() => {
    if (!mapData) return;
    if (!stage) return;
    stage.add(layer);
    fetchSection(mapData.id);
  }, [fetchSection, layer, mapData, mapData.id, stage]);

  useEffect(() => {
    return () => {
      guideSection?.destroy();
      sections.current.forEach((s: Section) => s.destroy());
    };
  }, [guideSection]);

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
