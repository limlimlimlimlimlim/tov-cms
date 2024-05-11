import { useContext, useRef } from 'react';
import type { Section } from '../../../../../../interface/section';
import { SectionContext } from '../../section-context';

declare const fabric: any;

const useTargetSectionPolygon = () => {
  const { canvas } = useContext<any>(SectionContext);
  const sectionsObject = useRef<any[]>([]);

  const render = (sections: Section[]) => {
    removeSectionsAll();
    renderSections(sections);
    canvas.renderAll();
  };

  const removeSectionsAll = () => {
    sectionsObject.current.forEach((s) => {
      canvas.remove(s);
    });
    sectionsObject.current = [];
  };

  const renderSections = (sections: Section[]) => {
    sections.forEach((s) => {
      const section = new fabric.Polygon(s.path, {
        fill: '#D81B60',
        strokeWidth: 4,
        stroke: 'green',
        objectCaching: false,
        transparentCorners: false,
        cornerColor: 'blue',
        selectable: false,
      });
      canvas.add(section);
      sectionsObject.current.push(section);
    });
  };

  return {
    render,
  };
};

export default useTargetSectionPolygon;
