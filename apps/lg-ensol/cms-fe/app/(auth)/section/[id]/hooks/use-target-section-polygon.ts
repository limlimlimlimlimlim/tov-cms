import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SectionContext } from '../section-context';
import { flatPath } from '../../../../../util/section';
import type { RootState } from '../../../../../store/store';
import { updateSection } from '../../../../../store/slice/add-section-slice';
import useEditableSection from './use-editable-section';
import { Position } from '../../../../../interface/section';

declare const Konva: any;

const useTargetSectionPolygon = () => {
  const { stage } = useContext<any>(SectionContext);
  const { newSections } = useSelector((state: RootState) => state.addSection);
  const sectionsObject = useRef<any[]>([]);
  const { create } = useEditableSection();
  const dispatch = useDispatch();

  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  const removeSectionsAll = useCallback(() => {
    sectionsObject.current.forEach((s) => {
      s.group.remove();
    });
    sectionsObject.current = [];
  }, []);

  const renderSections = useCallback(() => {
    newSections.forEach((s, index) => {
      if (sectionsObject.current[index]) {
        const { section } = sectionsObject.current[index];
        section.points(flatPath(s.path));
      } else {
        const section = create(
          newSections[index],
          ({ id, pointIndex, point }) => {
            dispatch(
              updateSection({
                id,
                pointIndex,
                point,
              }),
            );
          },
        );
        layer.add(section.group);
        sectionsObject.current.push(section);
      }
    });
  }, [create, dispatch, layer, newSections]);

  useEffect(() => {
    if (!stage) return;
    stage.add(layer);

    return () => {
      removeSectionsAll();
      layer.remove();
    };
  }, [layer, removeSectionsAll, stage]);

  useEffect(() => {
    renderSections();
  }, [newSections, renderSections]);
};

export default useTargetSectionPolygon;
