'use client';

import { Button, message } from 'antd';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SectionContext } from '../section-context';
import DesignSectionManager from '../classes/design-section-manger';
import {
  getSectionsByMapId,
  updateSectionPaintOptionById,
} from '../../../../../api/section';
import {
  convertToKonvaOptions,
  generateFacilityOptions,
  generatePaintOptions,
} from '../utils/utils';
import type Section from '../classes/section';
import useFaciltyInfo from '../hooks/use-facility-info';
import type { FacilityDesign } from '../../../../../interface/facility';
import { updateFacility } from '../../../../../api/facility';
import SectionDesignPanel from './section-desing-panel';

declare const Konva: any;

const SectionDesignStatePage = () => {
  const router = useRouter();
  const { mapData, stage } = useContext<any>(SectionContext);
  const [selectedSection, setSelectedSection] = useState<Section>();
  const chagedSections = useRef<Map<string | number, Section>>(new Map());
  const chagedFacilities = useRef<Map<string | number, FacilityDesign>>(
    new Map(),
  );
  const { addSection } = useFaciltyInfo();

  const designSectionManager = useMemo(() => {
    if (!stage) return;
    return new DesignSectionManager(stage);
  }, [stage]);

  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  const onClickSave = async () => {
    if (!designSectionManager) return;
    await upatePaintOptions();
    await upateFacilityOptions();
    message.success('구역이 수정 됐습니다.');
    router.replace(`/section/${mapData.id}/view`);
  };

  const upatePaintOptions = async () => {
    if (chagedSections.current.size === 0) return;
    const requests = Array.from(chagedSections.current).map(
      ([key, section]: [number | string, Section]) => {
        return updateSectionPaintOptionById(key, generatePaintOptions(section));
      },
    );
    return Promise.all(requests);
  };

  const upateFacilityOptions = async () => {
    if (chagedFacilities.current.size === 0) return;
    const requests = Array.from(chagedFacilities.current).map(
      ([key, facility]: [number | string, any]) => {
        return updateFacility(key, generateFacilityOptions(facility));
      },
    );
    return Promise.all(requests);
  };

  const fetchSection = useCallback(
    async (id) => {
      if (!designSectionManager) return;
      const response = await getSectionsByMapId(id);
      response.data.forEach((d) => {
        const sec = designSectionManager.addSection(
          d.path,
          d.id,
          convertToKonvaOptions(d),
          d.facilities[0],
        );
        addSection(sec);
      });
      designSectionManager.layer.moveToTop();
    },
    [addSection, designSectionManager],
  );

  const onChangeSectionsPaint = useCallback((section: Section) => {
    chagedSections.current.set(section.id as string, section);
  }, []);

  const onChangeFacility = useCallback(
    (facility: any) => {
      chagedFacilities.current.set(facility.id as string, facility);
      const icon = designSectionManager?.getIconById(facility.id);
      if (!icon) return;
      icon.fill(facility.iconColor);
    },
    [designSectionManager],
  );

  useEffect(() => {
    if (!mapData) return;
    if (!stage) return;
    if (!designSectionManager) return;

    stage.add(layer);
    fetchSection(mapData.id);
    designSectionManager.on('select', (section: Section) => {
      setSelectedSection(section);
    });
  }, [designSectionManager, fetchSection, layer, mapData, mapData.id, stage]);

  useEffect(() => {
    return () => {
      if (!designSectionManager) return;
      designSectionManager.destroy();
      layer.destroy();
      layer.remove();
    };
  }, [designSectionManager, layer, stage]);

  return (
    <>
      <Button onClick={onClickSave}>저장</Button>
      <Button>
        <Link href={`/section/${mapData.id}/view`}>취소</Link>
      </Button>
      {selectedSection && (
        <SectionDesignPanel
          section={selectedSection}
          onChangeSectionPaint={onChangeSectionsPaint}
          onChangeFacility={onChangeFacility}
        />
      )}
    </>
  );
};

export default SectionDesignStatePage;
