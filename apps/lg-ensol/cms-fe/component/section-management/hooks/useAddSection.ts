import { useEffect, useRef } from 'react';
import useGuideSectionPolygon from './useGuideSectionPolygon';
import useTargetSectionPolygon from './useTargetSectionPolygon';

declare const fabric: any;

const useAddSection = () => {
  const canvas = useRef<any>();
  const { init: initGuide, targetSections } = useGuideSectionPolygon();
  const { render: renderTargetSectionPolygons } = useTargetSectionPolygon();

  useEffect(() => {
    renderTargetSectionPolygons(targetSections);
  }, [renderTargetSectionPolygons, targetSections]);

  const start = (c) => {
    canvas.current = c;
    initGuide(c);
  };

  const end = () => {};

  return {
    start,
    end,
  };
};

export default useAddSection;
