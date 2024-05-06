import { useRef } from 'react';
import useGuideSectionPolygon from './useGuideSectionPolygon';

declare const fabric: any;

const useAddSection = () => {
  const canvas = useRef<any>();
  const { start: startGuide } = useGuideSectionPolygon();

  const start = (c) => {
    canvas.current = c;
    startGuide(c);
  };

  const end = () => {};

  return {
    start,
    end,
  };
};

export default useAddSection;
