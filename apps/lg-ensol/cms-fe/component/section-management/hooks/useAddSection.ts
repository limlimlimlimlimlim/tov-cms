import { useRef } from 'react';

declare const fabric: any;

const useAddSection = () => {
  const canvas = useRef<any>();
  const guidePolygonPoints = useRef<any[]>([]);
  const guidePolygonCircles = useRef<any[]>([]);
  const guidePolygonLines = useRef<any[]>([]);
  const guideLine = useRef<any>();
  const targetPolygons = useRef<{ x: number; y: number }[][]>([]);

  const start = (c) => {
    canvas.current = c;
    const guide = new fabric.Line([], {
      stroke: 'blue',
      strokeWidth: 2,
      selectable: false,
    });
    guide.set('x1', 0);
    guide.set('y1', 0);
    guide.set('x2', 0);
    guide.set('y2', 0);
    guideLine.current = guide;

    initEvents();
  };

  const initEvents = () => {
    if (!canvas.current) return;
    canvas.current.on('mouse:down', onMouseDown);
    canvas.current.on('mouse:move', onMouseMove);
    // canvas.current.on('mouse:up', onMouseMove);
  };

  const addPolygon = () => {
    if (!canvas.current) return;
    canvas.current.selection = true;
    canvas.current.remove(guideLine.current);
    targetPolygons.current.push(guidePolygonPoints.current);
    guidePolygonPoints.current = [];
  };

  const getLastPoint = () => {
    return guidePolygonPoints.current[guidePolygonPoints.current.length - 1];
  };

  const onMouseDown = (e) => {
    if (!canvas.current) return;
    if (e.e.altKey) return;
    if (e.target === guidePolygonCircles.current[0]) {
      guidePolygonPoints.current.push(guidePolygonPoints.current[0]);
      addPolygon();
    }
    if (e.target) return;
    canvas.current.selection = false;
    let x, y;
    if (e.e.shiftKey && guidePolygonPoints.current.length > 0) {
      x = guideLine.current.get('x2');
      y = guideLine.current.get('y2');
    } else {
      x = e.absolutePointer.x;
      y = e.absolutePointer.y;
    }

    guidePolygonPoints.current.push({ x, y });
    canvas.current.add(guideLine.current);
    guideLine.current.set('x1', x);
    guideLine.current.set('y1', y);
    guideLine.current.set('x2', x);
    guideLine.current.set('y2', y);
    forceUpdateGuidePolygons();
  };

  const forceUpdateGuidePolygons = () => {
    removeGuidePolygons();
    createGuidePolygon();
    canvas.current.renderAll();
  };

  const createLine = (x1, y1, x2, y2) => {
    const line = new fabric.Line([], {
      stroke: 'blue',
      strokeWidth: 2,
      selectable: false,
    });
    line.set('x1', x1);
    line.set('y1', y1);
    line.set('x2', x2);
    line.set('y2', y2);

    return line;
  };

  const createLines = (points: { x: number; y: number }[]) => {
    const lines: any[] = [];
    points.forEach(({ x, y }, index: number) => {
      if (index > 0) {
        const prevPoint = points[index - 1];
        const line = createLine(prevPoint.x, prevPoint.y, x, y);
        canvas.current.add(line);
        lines.push(line);
      }
    });
    return lines;
  };

  const createControlPoints = (points: { x: number; y: number }[]) => {
    const controls: any[] = [];
    points.forEach(({ x, y }) => {
      const circle = new fabric.Circle({
        radius: 10,
        fill: 'yellow',
        stroke: 'green',
        strokeWidth: 3,
        left: x,
        top: y,
        originX: 'center',
        originY: 'center',
        selectable: false,
      });
      canvas.current.add(circle);
      controls.push(circle);
    });
    return controls;
  };

  const createGuidePolygon = () => {
    const lines = createLines(guidePolygonPoints.current);
    guidePolygonLines.current = lines;

    const controlPoints = createControlPoints(guidePolygonPoints.current);
    guidePolygonCircles.current = controlPoints;
    controlPoints.forEach((p, index) => {
      p.on('mousedblclick', () => {
        guidePolygonPoints.current.splice(index, 1);
        forceUpdateGuidePolygons();
      });
    });
  };

  const removeGuidePolygons = () => {
    guidePolygonCircles.current.forEach((c) => {
      canvas.current.remove(c);
    });
    guidePolygonLines.current.forEach((l) => {
      canvas.current.remove(l);
    });
    guidePolygonCircles.current = [];
    guidePolygonLines.current = [];
  };

  const onMouseMove = (e) => {
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
    canvas.current.requestRenderAll();
  };

  const roundToNearest = (value: number, nearest = 10) => {
    const remainder = value % nearest;
    if (remainder < nearest / 2) {
      return value - remainder;
    }
    return value + (nearest - remainder);
  };

  const end = () => {};

  return {
    start,
    end,
  };
};

export default useAddSection;
