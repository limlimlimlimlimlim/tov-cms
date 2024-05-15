import { useContext, useEffect, useState } from 'react';
import { SectionContext } from '../section-context';
import type { Section } from '../../../../../interface/section';
import useGuideSectionPolygon from './use-guide-section-polygon';
import useTargetSectionPolygon from './use-rarget-section-polygon';

const useAddSection = () => {
  const { stage } = useContext<any>(SectionContext);
  const [newSections, setNewSections] = useState<Section[]>([]);

  useGuideSectionPolygon((newSection) => {
    setNewSections([...newSections, newSection]);
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
