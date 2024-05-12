import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SectionContext } from '../section-context';
import { createSectionObject } from '../utils/utils';
import { getSectionsByMapId } from '../../../../../api/section';

declare const Konva: any;

const useViewSection = () => {
  const { stage } = useContext<any>(SectionContext);
  const layer = useRef<any>();

  const render = useCallback(
    (sections) => {
      if (!stage) return;
      sections.forEach((s) => {
        const sec = createSectionObject(s.path.split(','));
        layer.current.add(sec);
      });
    },
    [stage],
  );

  const fetchSection = useCallback(
    async (id) => {
      const response = await getSectionsByMapId(id);
      render(response.data);
    },
    [render],
  );

  useEffect(() => {
    if (!stage) return;
    if (layer.current) {
      layer.current.remove();
    }
    layer.current = new Konva.Layer();
    stage.add(layer.current);

    return () => {
      layer.current.remove();
    };
  }, [stage]);

  return {
    fetchSection,
  };
};

export default useViewSection;
