import { useRef } from 'react';

declare const fabric: any;

const useTargetSectionPolygon = () => {
  const canvas = useRef<any>();
  const sections = useRef<any[]>([]);

  const init = (c) => {
    canvas.current = c;
  };

  const render = (polygons) => {
    removeSectionsAll();
    setTimeout(() => {
      renderSections(polygons);
      canvas.current.renderAll();
    }, 1);
  };

  const removeSectionsAll = () => {
    sections.current.forEach((s) => {
      canvas.current.remove(s);
    });
    sections.current = [];
  };

  const renderSections = (points: { x: number; y: number }[][]) => {
    points.forEach((p) => {
      const section = new fabric.Polygon(p, {
        fill: '#D81B60',
        strokeWidth: 4,
        stroke: 'green',
        objectCaching: false,
        transparentCorners: false,
        cornerColor: 'blue',
        selectable: false,
      });
      canvas.current.add(section);
      sections.current.push(section);
    });
  };

  return {
    init,
    render,
  };
};

export default useTargetSectionPolygon;
