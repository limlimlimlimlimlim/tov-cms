import { useRef } from 'react';

declare const fabric: any;

const useAddSection = () => {
  const canvas = useRef<any>();
  const currentPolygonPoints = useRef<any[]>([]);
  const currentPolygonCircles = useRef<any[]>([]);
  const currentPolygonLines = useRef<any[]>([]);
  const guideLine = useRef<any>();

  const init = (c) => {
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
    const lastLine: any = getLastLine();
    const firstPoint: any = getFirstPoint();
    lastLine.set('x2', firstPoint.left);
    lastLine.set('y2', firstPoint.top);
    // TODO: 도형 등록
  };

  const getFirstPoint = () => {
    return currentPolygonPoints.current[0];
  };

  const getLastPoint = () => {
    return currentPolygonPoints.current[
      currentPolygonPoints.current.length - 1
    ];
  };

  const getLastLine = () => {
    return currentPolygonLines.current[currentPolygonLines.current.length - 1];
  };

  const onMouseDown = (e) => {
    if (!canvas.current) return;
    if (e.e.altKey) return;
    if (e.target === currentPolygonPoints.current[0]) {
      addPolygon();
    }
    if (e.target) return;
    canvas.current.selection = false;
    const { x, y } = e.absolutePointer;
    currentPolygonPoints.current.push({ x, y });
    canvas.current.add(guideLine.current);
    guideLine.current.set('x1', x);
    guideLine.current.set('y1', y);
    guideLine.current.set('x2', x);
    guideLine.current.set('y2', y);
    forceUpdatePolygon();
  };

  const forceUpdatePolygon = () => {
    removePolygon();
    createPolygon();
    canvas.current.renderAll();
  };

  const createPolygon = () => {
    currentPolygonPoints.current.forEach(({ x, y }, index: number) => {
      if (index > 0) {
        const prevPoint = currentPolygonPoints.current[index - 1];
        const line = new fabric.Line([], {
          stroke: 'blue',
          strokeWidth: 2,
          selectable: false,
        });
        line.set('x1', prevPoint.x);
        line.set('y1', prevPoint.y);
        line.set('x2', x);
        line.set('y2', y);
        canvas.current.add(line);
        currentPolygonLines.current.push(line);
      }
    });

    currentPolygonPoints.current.forEach(({ x, y }, index) => {
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
      currentPolygonCircles.current.push(circle);

      circle.on('mousedblclick', () => {
        currentPolygonPoints.current.splice(index, 1);
        forceUpdatePolygon();
      });
    });
  };

  const removePolygon = () => {
    currentPolygonCircles.current.forEach((c) => {
      canvas.current.remove(c);
    });
    currentPolygonLines.current.forEach((l) => {
      canvas.current.remove(l);
    });
    currentPolygonCircles.current = [];
    currentPolygonLines.current = [];
  };

  const onMouseMove = (e) => {
    const lastPoint = getLastPoint();

    if (!lastPoint) return;
    if (!e.absolutePointer) return;
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

  const destory = () => {};

  return {
    init,
    destory,
  };
};

export default useAddSection;
