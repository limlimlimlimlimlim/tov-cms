import { useRef } from 'react';
import type { Section } from '../../../../../../interface/section';

declare const fabric: any;

const useTargetSectionPolygon = () => {
  const canvas = useRef<any>();
  const sectionsObject = useRef<any[]>([]);

  const init = (c) => {
    canvas.current = c;
  };

  const render = (sections: Section[]) => {
    removeSectionsAll();
    setTimeout(() => {
      renderSections(sections);
      canvas.current.renderAll();
    }, 1);
  };

  const removeSectionsAll = () => {
    sectionsObject.current.forEach((s) => {
      canvas.current.remove(s);
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
      canvas.current.add(section);
      sectionsObject.current.push(section);
    });
  };

  return {
    init,
    render,
  };
};

export default useTargetSectionPolygon;
