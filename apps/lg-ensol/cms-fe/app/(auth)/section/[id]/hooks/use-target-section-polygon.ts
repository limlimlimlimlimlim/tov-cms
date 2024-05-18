import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import type { Section } from '../../../../../interface/section';
import { SectionContext } from '../section-context';

declare const Konva: any;

// TODO: target 렌더링
const useTargetSectionPolygon = () => {
  const { stage } = useContext<any>(SectionContext);
  const sectionsObject = useRef<any[]>([]);

  const layer = useMemo(() => {
    console.log('use Memo');
    return new Konva.Layer();
  }, []);

  const render = (sections: Section[]) => {
    if (!stage) return;
    removeSectionsAll();
    renderSections(sections);
  };

  const removeSectionsAll = useCallback(() => {
    sectionsObject.current.forEach((s) => {
      s.remove();
    });
    sectionsObject.current = [];
  }, []);

  const renderSections = (sections: Section[]) => {
    sections.forEach((s) => {
      const g = editablePolygon(s.path);
      layer.add(g);
      console.log(g);
      // canvas.add(g);
      sectionsObject.current.push(g);
    });
  };

  useEffect(() => {
    if (!stage) return;
    console.log(layer);
    stage.add(layer);

    return () => {
      removeSectionsAll();
      layer.remove();
    };
  }, [layer, removeSectionsAll, stage]);

  return {
    render,
  };
};

export default useTargetSectionPolygon;

const editablePolygon = (path) => {
  const group = new Konva.Group();

  const section = new Konva.Line({
    points: path.map((p) => p.toArray()).flat(),
    fill: '#ff9900',
    stroke: '#FF2233',
    strokeWidth: 1,
    opacity: 0.5,
    closed: true,
  });

  group.add(section);
  return group;
};
