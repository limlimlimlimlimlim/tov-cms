import { useCallback, useContext, useEffect, useRef } from 'react';
import { SectionContext } from '../section-context';

declare const fabric: any;

const useGuideSectionPolygon = (addSectionCallback) => {
  const { canvas } = useContext<any>(SectionContext);
  const guidePolygonPoints = useRef<any[]>([]);
  const guidePolygonCircles = useRef<any[]>([]);
  const guidePolygonLines = useRef<any[]>([]);
  const guideLine = useRef<any>();

  const removeGuidePolygons = useCallback(() => {
    guidePolygonCircles.current.forEach((c) => {
      canvas.remove(c);
    });
    guidePolygonLines.current.forEach((l) => {
      canvas.remove(l);
    });
    guidePolygonCircles.current = [];
    guidePolygonLines.current = [];
  }, [canvas]);

  const onDbClickControlPoint = useCallback(
    (index) => {
      guidePolygonPoints.current.splice(index, 1);
      removeGuidePolygons();
      //   createGuidePolygon();
      canvas.renderAll();
    },
    [canvas, removeGuidePolygons],
  );

  const addControlPointEvent = useCallback(
    (controlPoints) => {
      controlPoints.forEach((p, index) => {
        p.on('mousedblclick', () => {
          onDbClickControlPoint(index);
        });
      });
    },
    [onDbClickControlPoint],
  );

  const createControlPoints = useCallback(
    (points: { x: number; y: number }[]) => {
      const controls: any[] = [];
      points.forEach(({ x, y }) => {
        const circle = new fabric.Circle({
          radius: 4,
          fill: '#FF2233',
          left: x,
          top: y,
          originX: 'center',
          originY: 'center',
          selectable: false,
        });
        canvas.add(circle);
        controls.push(circle);
      });
      return controls;
    },
    [canvas],
  );

  const createLine = (x1, y1, x2, y2) => {
    const line = new fabric.Line([], {
      stroke: '#FF2233',
      strokeWidth: 1,
      selectable: false,
    });
    line.set('x1', x1);
    line.set('y1', y1);
    line.set('x2', x2);
    line.set('y2', y2);

    return line;
  };

  const createLines = useCallback(
    (points: { x: number; y: number }[]) => {
      const lines: any[] = [];
      points.forEach(({ x, y }, index: number) => {
        if (index > 0) {
          const prevPoint = points[index - 1];
          const line = createLine(prevPoint.x, prevPoint.y, x, y);
          canvas.add(line);
          lines.push(line);
        }
      });
      return lines;
    },
    [canvas],
  );

  const createGuidePolygon = useCallback(() => {
    const lines = createLines(guidePolygonPoints.current);
    guidePolygonLines.current = lines;

    const controlPoints = createControlPoints(guidePolygonPoints.current);
    guidePolygonCircles.current = controlPoints;
    addControlPointEvent(controlPoints);
  }, [addControlPointEvent, createControlPoints, createLines]);

  const forceUpdateGuidePolygons = useCallback(() => {
    removeGuidePolygons();
    createGuidePolygon();
    canvas.renderAll();
  }, [canvas, createGuidePolygon, removeGuidePolygons]);

  const end = useCallback(() => {
    if (!canvas) return;
    addSectionCallback({ path: guidePolygonPoints.current });
    guidePolygonPoints.current = [];
    canvas.selection = true;
    canvas.remove(guideLine.current);
    removeGuidePolygons();
  }, [addSectionCallback, canvas, removeGuidePolygons]);

  const onMouseDown = useCallback(
    (e) => {
      if (!canvas) return;
      if (e.target.editable) return;
      if (e.e.altKey) return;
      if (e.target === guidePolygonCircles.current[0]) {
        guidePolygonPoints.current.push(guidePolygonPoints.current[0]);
        end();
        return;
      }
      canvas.selection = false;
      let x, y;
      if (e.e.shiftKey && guidePolygonPoints.current.length > 0) {
        x = guideLine.current.get('x2');
        y = guideLine.current.get('y2');
      } else {
        x = e.absolutePointer.x;
        y = e.absolutePointer.y;
      }

      guidePolygonPoints.current.push({ x, y });
      canvas.remove(guideLine.current);
      canvas.add(guideLine.current);
      guideLine.current.set('x1', x);
      guideLine.current.set('y1', y);
      guideLine.current.set('x2', x);
      guideLine.current.set('y2', y);
      forceUpdateGuidePolygons();
    },
    [canvas, end, forceUpdateGuidePolygons],
  );

  const onMouseMove = useCallback(
    (e) => {
      const lastPoint = getLastPoint();

      if (!lastPoint) return;
      if (!e.absolutePointer) return;
      guideLine.current.set('x1', lastPoint.x);
      guideLine.current.set('y1', lastPoint.y);
      if (e.e.shiftKey) {
        const { x, y } = lastPoint;
        const radian =
          Math.round(
            Math.atan2(e.absolutePointer.y - y, e.absolutePointer.x - x) * 10,
          ) / 10;

        const degree = (radian * 180) / Math.PI;
        const roundDgreeToNearest10 = roundToNearest(degree);
        const roundRadianToNearest10 = (roundDgreeToNearest10 * Math.PI) / 180;
        const radius = Math.sqrt(
          Math.pow(e.absolutePointer.y - y, 2) +
            Math.pow(e.absolutePointer.x - x, 2),
        );

        const x2 = x + radius * Math.cos(roundRadianToNearest10);
        const y2 = y + radius * Math.sin(roundRadianToNearest10);
        guideLine.current.set('x2', x2);
        guideLine.current.set('y2', y2);
      } else {
        guideLine.current.set('x2', e.absolutePointer.x);
        guideLine.current.set('y2', e.absolutePointer.y);
      }
      canvas.requestRenderAll();
    },
    [canvas],
  );

  const initEvents = useCallback(() => {
    if (!canvas) return;
    canvas.off('mouse:down', onMouseDown);
    canvas.off('mouse:move', onMouseMove);
    canvas.on('mouse:down', onMouseDown);
    canvas.on('mouse:move', onMouseMove);
  }, [canvas, onMouseDown, onMouseMove]);

  const init = useCallback(() => {
    const guide = new fabric.Line([], {
      stroke: '#FF2233',
      strokeWidth: 1,
      selectable: false,
    });
    guide.set('x1', 0);
    guide.set('y1', 0);
    guide.set('x2', 0);
    guide.set('y2', 0);
    if (guideLine.current) {
      canvas.remove(guideLine.current);
    }
    guideLine.current = guide;
  }, [canvas]);

  const getLastPoint = () => {
    return guidePolygonPoints.current[guidePolygonPoints.current.length - 1];
  };

  const roundToNearest = (value: number, nearest = 10) => {
    const remainder = value % nearest;
    if (remainder < nearest / 2) {
      return value - remainder;
    }
    return value + (nearest - remainder);
  };

  useEffect(() => {
    if (!canvas) return;
    init();
    initEvents();
  }, [canvas, init, initEvents]);

  useEffect(() => {
    return () => {
      if (!canvas) return;
      canvas.off('mouse:down', onMouseDown);
      canvas.off('mouse:move', onMouseMove);
      removeGuidePolygons();
      canvas.remove(guideLine.current);
      guideLine.current = null;
      guidePolygonPoints.current = [];
      canvas.selection = true;
    };
  }, [canvas, onMouseDown, onMouseMove, removeGuidePolygons]);
};

export default useGuideSectionPolygon;
