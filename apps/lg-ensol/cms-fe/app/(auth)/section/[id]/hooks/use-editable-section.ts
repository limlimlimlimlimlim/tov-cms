import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSectionPoint, flatPath } from '../../../../../util/section';
import type { RootState } from '../../../../../store/store';
import { updateSection } from '../../../../../store/slice/add-section-slice';
import { shiftMove } from '../utils/utils';
import { SectionContext } from '../section-context';

declare const Konva: any;

const useEditableSection = () => {
  const { newSections } = useSelector((state: RootState) => state.addSection);
  const { stage } = useContext<any>(SectionContext);
  const dispatch = useDispatch();

  const onDragMove = useCallback(
    (e, controls, sectionIndex, pointIndex) => {
      let { newX, newY } = { newX: 0, newY: 0 };

      const control =
        controls[
          pointIndex === 0
            ? newSections[sectionIndex].path.length - 1
            : pointIndex - 1
        ];
      const x = control.x();
      const y = control.y();
      const { x: relX, y: relY } = stage.getRelativePointerPosition();
      if (e.evt.shiftKey) {
        const shiftPosition = shiftMove(x, y, relX, relY);
        newX = shiftPosition.x;
        newY = shiftPosition.y;
      } else {
        newX = relX;
        newY = relY;
      }
      e.target.x(newX);
      e.target.y(newY);
      dispatch(
        updateSection({
          sectionIndex,
          pointIndex,
          point: createSectionPoint(newX, newY),
        }),
      );
    },
    [dispatch, newSections, stage],
  );

  const create = useCallback(
    (sectionIndex) => {
      const s = newSections[sectionIndex];
      let { path } = s;
      const group = new Konva.Group();
      const controlPointsGroup = new Konva.Group();

      const section = new Konva.Line({
        points: flatPath(path),
        fill: '#ff9900',
        stroke: '#FF2233',
        strokeWidth: 1,
        opacity: 0.5,
        closed: true,
        draggable: true,
      });

      section.on('mousedown', (e) => {
        e.cancelBubble = true;
      });

      section.on('dragstart', () => {
        controlPointsGroup.hide();
      });

      section.on('dragend', () => {
        controlPointsGroup.show();
        const x = section.x();
        const y = section.y();
        const newPath = controls.map((c) => {
          return { x: c.x() + x, y: c.y() + y };
        });
        newPath.forEach((p, pointIndex) => {
          dispatch(
            updateSection({
              sectionIndex,
              pointIndex,
              point: createSectionPoint(p.x, p.y),
            }),
          );
        });
        section.x(0);
        section.y(0);
        section.points(flatPath(newPath));
        path = newPath;

        controls.forEach((c, i) => {
          c.x(path[i].x);
          c.y(path[i].y);
        });
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
          onDragMove(e, controls, sectionIndex, index);
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
