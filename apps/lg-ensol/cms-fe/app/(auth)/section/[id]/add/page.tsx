'use client';

import { Button, message } from 'antd';
import { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { SectionContext } from '../section-context';
import { addSection } from '../../../../../api/section';
import useViewSection from '../hooks/use-view-section';
import type { RootState } from '../../../../../store/store';
import useGuideSectionPolygon from '../hooks/use-guide-section-polygon';
import useTargetSectionPolygon from '../hooks/use-target-section-polygon';
import { clearNewSections } from '../../../../../store/slice/add-section-slice';

const SectionAddStatePage = () => {
  const router = useRouter();
  const { mapData } = useContext<any>(SectionContext);
  const { fetchSection } = useViewSection();
  const { newSections } = useSelector((state: RootState) => state.addSection);
  const dispatch = useDispatch();

  useGuideSectionPolygon();
  useTargetSectionPolygon();

  const onClickSave = async () => {
    const requests = newSections.map((s) => {
      return addSection(
        mapData.id,
        s.path
          .map((p: any) => [p.x, p.y])
          .flat()
          .join(),
      );
    });
    await Promise.all(requests);
    message.success('구역이 추가 됐습니다.');
    router.replace(`/section/${mapData.id}/view`);
  };

  useEffect(() => {
    fetchSection(mapData.id);
  }, [fetchSection, mapData.id]);

  useEffect(() => {
    return () => {
      dispatch(clearNewSections());
    };
  }, [dispatch]);

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
