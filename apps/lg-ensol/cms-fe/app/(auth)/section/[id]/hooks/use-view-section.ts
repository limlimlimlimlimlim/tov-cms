import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { SectionContext } from '../section-context';
import { createSectionObject } from '../utils/utils';
import { getSectionsByMapId } from '../../../../../api/section';
import { setViewSections } from '../../../../../store/slice/view-section-slice';

declare const Konva: any;

const useViewSection = () => {
  const { stage, setSectionObjects } = useContext<any>(SectionContext);
  const dispatch = useDispatch();
  const layer: any = useMemo(() => {
    const layer = new Konva.Layer();
    layer.setAttr('id', 'sectionLayer');
    return layer;
  }, []);

  const render = useCallback(
    (sections) => {
      if (!stage) return;
      const sectionObjects: any[] = [];
      sections.forEach((s) => {
        const sec = createSectionObject(s.path.split(','));
        sectionObjects.push(sec);
        layer.add(sec);
      });
      setSectionObjects(sectionObjects);
    },
    [layer, setSectionObjects, stage],
  );

  const fetchSection = useCallback(
    async (id) => {
      const response = await getSectionsByMapId(id);
      render(response.data);
      dispatch(setViewSections(response.data));
    },
    [dispatch, render],
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
