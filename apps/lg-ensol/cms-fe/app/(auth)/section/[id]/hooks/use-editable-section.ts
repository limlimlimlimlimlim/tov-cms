import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSectionPoint, flatPath } from '../../../../../util/section';
import type { RootState } from '../../../../../store/store';
import { updateSection } from '../../../../../store/slice/add-section-slice';

declare const Konva: any;

const useEditableSection = () => {
  const { newSections } = useSelector((state: RootState) => state.addSection);
  const dispatch = useDispatch();

  const onDragMove = useCallback(
    (e, sectionIndex, pointIndex) => {
      const position = e.target.getStage().getRelativePointerPosition();
      dispatch(
        updateSection({
          sectionIndex,
          pointIndex,
          point: createSectionPoint(position.x, position.y),
        }),
      );
    },
    [dispatch],
  );

  const create = useCallback(
    (sectionIndex) => {
      const s = newSections[sectionIndex];
      const { path } = s;
      const group = new Konva.Group();
      const controlPointsGroup = new Konva.Group();
      const section = new Konva.Line({
        points: flatPath(path),
        fill: '#ff9900',
        stroke: '#FF2233',
        strokeWidth: 1,
        opacity: 0.5,
        closed: true,
      });

      group.add(section);
      group.add(controlPointsGroup);

      const controls = path.map((p) => {
        const c = new Konva.Circle({
          x: p.x,
          y: p.y,
          radius: 6,
          fill: 'yellow',
          stroke: 'black',
          draggable: true,
        });
        return c;
      });

      controlPointsGroup.add(...controls);

      controls.forEach((c, index) => {
        c.on('mousedown', (e) => (e.cancelBubble = true));
        c.on('dragmove', (e) => {
          onDragMove(e, sectionIndex, index);
        });
      });

      return {
        group,
        section,
        controls,
      };
    },
    [newSections, onDragMove],
  );

  return {
    create,
  };
};

export default useEditableSection;
