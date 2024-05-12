import { useCallback, useContext, useEffect, useRef } from 'react';
import type { Section } from '../../../../../interface/section';
import { SectionContext } from '../section-context';

declare const fabric: any;

const useTargetSectionPolygon = () => {
  const { canvas } = useContext<any>(SectionContext);
  const sectionsObject = useRef<any[]>([]);

  const render = (sections: Section[]) => {
    removeSectionsAll();
    renderSections(sections);
    canvas.renderAll();
  };

  const removeSectionsAll = useCallback(() => {
    sectionsObject.current.forEach((s) => {
      canvas.remove(s);
    });
    sectionsObject.current = [];
  }, [canvas]);

  const renderSections = (sections: Section[]) => {
    sections.forEach((s) => {
      const section = new fabric.Polygon(s.path, {
        fill: '#D2C60C',
        opacity: 0.3,
      });

      const sectionBorder = new fabric.Polygon(s.path, {
        strokeWidth: 5,
        stroke: '#D2C60C',
        opacity: 0.3,
        fill: '',
        strokeLineCap: 'round',
        strokeLineJoin: 'bevel',
      });
      const g = new fabric.Group([section, sectionBorder], {
        selectable: false,
      });
      canvas.add(g);
      sectionsObject.current.push(g);
    });
  };

  useEffect(() => {
    return () => {
      removeSectionsAll();
    };
  }, [removeSectionsAll]);

  return {
    render,
  };
};

export default useTargetSectionPolygon;