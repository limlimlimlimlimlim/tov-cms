import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SectionContext } from '../section-context';

declare const fabric: any;
declare const Konva: any;

const useGuideSectionPolygon = (addSectionCallback) => {
  const { stage, canvas } = useContext<any>(SectionContext);
  const guidePolygonPoints = useRef<any[]>([]);
  const guidePolygonCircles = useRef<any[]>([]);
  const guidePolygonLines = useRef<any[]>([]);

  const layer = useMemo(() => {
    return new Konva.Layer();
  }, []);

  const guideLine = useMemo(() => {
    return new Konva.Line({
      points: [],
      fill: '',
      stroke: '#FF2233',
      strokeWidth: 1,
      closed: true,
    });
  }, []);

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
  }, [addSectionCallback, canvas, guideLine, removeGuidePolygons]);

  const updateGuideLine = useCallback(
    (points) => {
      guideLine.points(points);
    },
    [guideLine],
  );

  const onMouseMove = useCallback(
    (e) => {
      const { layerX, layerY, shiftKey } = e.evt;
      // const lastPoint = getLastPoint();
      // if (!lastPoint) return;
      // if (!e.absolutePointer) return;
      // guideLine.current.set('x1', lastPoint.x);
      // guideLine.current.set('y1', lastPoint.y);
      if (guidePolygonPoints.current.length === 0) return;
      if (shiftKey) {
        const x =
          guidePolygonPoints.current[guidePolygonPoints.current.length - 4];
        const y =
          guidePolygonPoints.current[guidePolygonPoints.current.length - 3];
        const radian = Math.round(Math.atan2(layerY - y, layerX - x) * 10) / 10;

        const degree = (radian * 180) / Math.PI;
        const roundDgreeToNearest10 = roundToNearest(degree);
        const roundRadianToNearest10 = (roundDgreeToNearest10 * Math.PI) / 180;
        const radius = Math.sqrt(
          Math.pow(layerY - y, 2) + Math.pow(layerX - x, 2),
        );
        const x2 = x + radius * Math.cos(roundRadianToNearest10);
        const y2 = y + radius * Math.sin(roundRadianToNearest10);

        guidePolygonPoints.current[guidePolygonPoints.current.length - 2] = x2;
        guidePolygonPoints.current[guidePolygonPoints.current.length - 1] = y2;
      } else {
        guidePolygonPoints.current[guidePolygonPoints.current.length - 2] =
          layerX;
        guidePolygonPoints.current[guidePolygonPoints.current.length - 1] =
          layerY;
      }
      updateGuideLine(guidePolygonPoints.current);
    },
    [updateGuideLine],
  );

  const onMouseDown = useCallback(
    (e) => {
      if (!stage) return;
      const { layerX, layerY } = e.evt;
      // guidePolygonPoints.current.push(...[layerX, layerY, layerX, layerY]);

      // guideLine.current.points(guidePolygonPoints.current);

      // guidePolygonPoints.current.push(...[])
      // if (e.target === guidePolygonCircles.current[0]) {
      //   guidePolygonPoints.current.push(guidePolygonPoints.current[0]);
      //   end();
      //   return;
      // }

      let x, y;
      if (e.evt.shiftKey && guidePolygonPoints.current.length > 0) {
        x = guidePolygonPoints.current[guidePolygonPoints.current.length - 2];
        y = guidePolygonPoints.current[guidePolygonPoints.current.length - 1];
      } else {
        x = layerX;
        y = layerY;
      }
      guidePolygonPoints.current.pop();
      guidePolygonPoints.current.pop();
      guidePolygonPoints.current.push(...[x, y, x, y]);
      // guidePolygonPoints.current.push({ x, y });
      // canvas.remove(guideLine.current);
      // canvas.add(guideLine.current);
      // guideLine.current.set('x1', x);
      // guideLine.current.set('y1', y);
      // guideLine.current.set('x2', x);
      // guideLine.current.set('y2', y);
      // forceUpdateGuidePolygons();
      updateGuideLine(guidePolygonPoints.current);
    },
    [stage, updateGuideLine],
  );

  const initEvents = useCallback(() => {
    if (!stage) return;
    stage.add(layer);
    stage.on('mousedown', onMouseDown);
    stage.on('mousemove', onMouseMove);
  }, [layer, onMouseDown, onMouseMove, stage]);

  const init = useCallback(() => {
    setTimeout(() => {
      stage.add(layer);
      layer.add(guideLine);
    }, 1000);

    // const guide = new fabric.Line([], {
    //   stroke: '#FF2233',
    //   strokeWidth: 1,
    //   selectable: false,
    // });
    // guide.set('x1', 0);
    // guide.set('y1', 0);
    // guide.set('x2', 0);
    // guide.set('y2', 0);
    // if (guideLine.current) {
    //   canvas.remove(guideLine.current);
    // }
  }, [guideLine, layer, stage]);

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
    if (!stage) return;
    init();
    initEvents();
    return () => {
      layer.remove();
      console.log('destroy!!!');
      stage.off('mousedown');
      stage.off('mousemove');
      removeGuidePolygons();
      guideLine.remove();
      guidePolygonPoints.current = [];
      canvas.selection = true;
    };
  }, [canvas, guideLine, init, initEvents, layer, removeGuidePolygons, stage]);
};

export default useGuideSectionPolygon;
