import { useContext, useEffect, useRef } from 'react';
import { SectionContext } from '../../section-context';
import useGuideSectionPolygon from './useGuideSectionPolygon';
import useTargetSectionPolygon from './useTargetSectionPolygon';

const useAddSection = () => {
  const canvas = useRef<any>();
  const { newSections } = useContext<any>(SectionContext);
  const { init: initGuide } = useGuideSectionPolygon();
  const { init: initTarget, render: renderTargetSectionPolygons } =
    useTargetSectionPolygon();

  useEffect(() => {
    if (!canvas.current) return;
    renderTargetSectionPolygons(newSections);
  }, [newSections, renderTargetSectionPolygons]);

  const start = (c) => {
    canvas.current = c;
    initGuide(c);
    initTarget(c);
  };

  const end = () => {};

  return {
    start,
    end,
  };
};

export default useAddSection;
