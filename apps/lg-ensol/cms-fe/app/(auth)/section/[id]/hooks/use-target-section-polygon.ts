import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import type { Section } from '../../../../../interface/section';
import { SectionContext } from '../section-context';
import useEditableSection from './use-editable-section';

declare const Konva: any;

const useTargetSectionPolygon = () => {
  const { stage } = useContext<any>(SectionContext);
  const sectionsObject = useRef<any[]>([]);
  const { createEditableSection } = useEditableSection();

  const layer = useMemo(() => {
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
      const g = createEditableSection(s.path);
      layer.add(g);
      sectionsObject.current.push(g);
    });
  };

  useEffect(() => {
    if (!stage) return;
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
