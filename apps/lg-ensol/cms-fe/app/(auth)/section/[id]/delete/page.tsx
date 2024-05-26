'use client';

import { Button, message } from 'antd';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import {
  deleteSectionById,
  getSectionsByMapId,
} from '../../../../../api/section';
import DeletableSectionManager from '../classes/deletable-section-manger';

declare const Konva: any;

const SectionDeleteStatePage = () => {
  const router = useRouter();
  const { mapData, stage } = useContext<any>(SectionContext);

  const deletableSectionManager = useMemo(() => {
    if (!stage) return;
    return new DeletableSectionManager(stage);
  }, [stage]);

  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  const onClickSave = async () => {
    if (!deletableSectionManager) return;
    const requests = Array.from(deletableSectionManager.deleteSections).map(
      ([key]: [number]) => {
        return deleteSectionById(key);
      },
    );

    await Promise.all(requests);
    message.success('구역이 삭제 됐습니다.');
    router.replace(`/section/${mapData.id}/view`);
  };

  const fetchSection = useCallback(
    async (id) => {
      if (!deletableSectionManager) return;
      const response = await getSectionsByMapId(id);
      response.data.forEach((d) => {
        deletableSectionManager.addSection(d.path, d.id);
      });
      deletableSectionManager.layer.moveToTop();
    },
    [deletableSectionManager],
  );

  useEffect(() => {
    if (!mapData) return;
    if (!stage) return;
    if (!deletableSectionManager) return;
    stage.add(layer);
    fetchSection(mapData.id);
  }, [
    deletableSectionManager,
    fetchSection,
    layer,
    mapData,
    mapData.id,
    stage,
  ]);

  useEffect(() => {
    return () => {
      if (!deletableSectionManager) return;
      deletableSectionManager.destroy();
      layer.destroy();
      layer.remove();
    };
  }, [deletableSectionManager, layer, stage]);

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

export default SectionDeleteStatePage;
