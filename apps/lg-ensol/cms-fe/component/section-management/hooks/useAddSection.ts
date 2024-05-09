import { useEffect, useRef } from 'react';
import useGuideSectionPolygon from './useGuideSectionPolygon';
import useTargetSectionPolygon from './useTargetSectionPolygon';

const useAddSection = () => {
  const canvas = useRef<any>();
  const { init: initGuide, targetSections } = useGuideSectionPolygon();
  const { init: initTarget, render: renderTargetSectionPolygons } =
    useTargetSectionPolygon();

  useEffect(() => {
    if (!canvas.current) return;
    renderTargetSectionPolygons(targetSections);
  }, [renderTargetSectionPolygons, targetSections]);

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
