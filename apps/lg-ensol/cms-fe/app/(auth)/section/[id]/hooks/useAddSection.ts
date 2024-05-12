import { useContext, useEffect, useState } from 'react';
import { SectionContext } from '../section-context';
import type { Section } from '../../../../../interface/section';
import useGuideSectionPolygon from './useGuideSectionPolygon';
import useTargetSectionPolygon from './useTargetSectionPolygon';

const useAddSection = () => {
  const { canvas } = useContext<any>(SectionContext);
  const [newSections, setNewSections] = useState<Section[]>([]);
  useGuideSectionPolygon((newSection) => {
    setNewSections([...newSections, newSection]);
  });
  const { render: renderTargetSectionPolygons } = useTargetSectionPolygon();

  useEffect(() => {
    if (!canvas) return;
    renderTargetSectionPolygons(newSections);
  }, [canvas, newSections, renderTargetSectionPolygons]);

  return {
    newSections,
  };
};

export default useAddSection;
