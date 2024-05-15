import { useCallback, useContext, useEffect, useMemo } from 'react';
import { SectionContext } from '../section-context';
import { createSectionObject } from '../utils/utils';
import { getSectionsByMapId } from '../../../../../api/section';

declare const Konva: any;

const useViewSection = () => {
  const { stage } = useContext<any>(SectionContext);
  const layer: any = useMemo(() => {
    const layer = new Konva.Layer();
    layer.setAttr('id', 'sectionLayer');
    return layer;
  }, []);

  const render = useCallback(
    (sections) => {
      if (!stage) return;
      sections.forEach((s) => {
        const sec = createSectionObject(s.path.split(','));
        layer.add(sec);
      });
    },
    [layer, stage],
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
    stage.add(layer);

    return () => {
      layer.remove();
    };
  }, [layer, stage]);

  return {
    fetchSection,
  };
};

export default useViewSection;
