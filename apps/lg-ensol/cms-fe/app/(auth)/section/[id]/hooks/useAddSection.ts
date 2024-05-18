import { useContext, useEffect, useState } from 'react';
import { SectionContext } from '../section-context';
import type { Section } from '../../../../../interface/section';
import useGuideSectionPolygon from './useGuideSectionPolygon';
import useTargetSectionPolygon from './useTargetSectionPolygon';

const useAddSection = () => {
  const { stage } = useContext<any>(SectionContext);
  const [newSections, setNewSections] = useState<Section[]>([]);

  useGuideSectionPolygon((newSection) => {
    setNewSections([...newSections, newSection]);
    console.log([...newSections, newSection]); // 포지선 컨버팅
  });
  const { render: renderTargetSectionPolygons } = useTargetSectionPolygon();

  useEffect(() => {
    if (!stage) return;
    renderTargetSectionPolygons(newSections);
  }, [stage, newSections, renderTargetSectionPolygons]);

  return {
    newSections,
  };
};

export default useAddSection;
