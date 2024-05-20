'use client';

import { Button, message } from 'antd';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import { getSectionsByMapId } from '../../../../../api/section';
import useEditableSection from '../hooks/use-editable-section';
import { pathToPoints } from '../../../../../util/section';

declare const Konva: any;

const SectionEditStatePage = () => {
  console.log('SectionEditStatePage');
  const router = useRouter();
  const { stage, mapData, sectionObjects } = useContext<any>(SectionContext);
  const { create } = useEditableSection();
  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);
  const onClickSave = () => {
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
    message.success('구역이 수정 됐습니다.');
    router.replace(`/section/${mapData.id}/view`);
  };

  const fetchSection = useCallback(
    async (id) => {
      const response = await getSectionsByMapId(id);
      response.data.forEach((s) => {
        s.path = pathToPoints(s.path);
        const { group } = create(s, () => {
          //
        });

        layer.add(group);
      });
    },
    [create, layer],
  );

  useEffect(() => {
    if (!stage) return;
    fetchSection(mapData.id);
    stage.add(layer);
    console.log(layer);
  }, [fetchSection, layer, mapData.id, stage]);

  //const response = await getSectionsByMapId(id);

  useEffect(() => {}, [sectionObjects]);

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

export default SectionEditStatePage;
