import { useRef } from 'react';

declare const fabric: any;

const useAddSection = () => {
  const canvas = useRef<any>();
  const currentPolygonPoints = useRef<any[]>([]);
  const currentPolygonLines = useRef<any[]>([]);

  const init = (c) => {
    canvas.current = c;
    initEvents();
  };

  const initEvents = () => {
    if (!canvas.current) return;
    canvas.current.on('mouse:down', onMouseDown);
    canvas.current.on('mouse:move', onMouseMove);
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

  const getLastLine = () => {
    return currentPolygonLines.current[currentPolygonLines.current.length - 1];
  };

  const onMouseDown = (e) => {
    if (!canvas.current) return;
    if (e.target === currentPolygonPoints.current[0]) {
      addPolygon();
    }
    if (e.target) return;
    canvas.current.selection = false;
    const lastLine: any = getLastLine();
    const x = lastLine ? lastLine.x2 : e.absolutePointer.x;
    const y = lastLine ? lastLine.y2 : e.absolutePointer.y;

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

    circle.on('mousedblclick', () => {
      canvas.current.remove(circle);
      canvas.current.renderAll();
    });

    currentPolygonPoints.current.push(circle);
    canvas.current.add(circle);

    const line = new fabric.Line([], {
      stroke: 'blue',
      strokeWidth: 2,
      selectable: false,
    });
    line.set('x1', x);
    line.set('y1', y);
    line.set('x2', x);
    line.set('y2', y);
    currentPolygonLines.current.push(line);
    canvas.current.add(line);

    canvas.current.on('mouse:up', onMouseMove);
  };

  const onMouseMove = (e) => {
    const lastLine = getLastLine();

    if (!lastLine) return;
    if (!e.absolutePointer) return;
    if (e.e.shiftKey) {
      const { x1, y1 } = lastLine;
      const radian =
        Math.round(
          Math.atan2(e.absolutePointer.y - y1, e.absolutePointer.x - x1) * 10,
        ) / 10;

      const degree = (radian * 180) / Math.PI;
      const roundDgreeToNearest10 = roundToNearest(degree);
      const roundRadianToNearest10 = (roundDgreeToNearest10 * Math.PI) / 180;
      const radius = Math.sqrt(
        Math.pow(e.absolutePointer.y - y1, 2) +
          Math.pow(e.absolutePointer.x - x1, 2),
      );

      const x2 = x1 + radius * Math.cos(roundRadianToNearest10);
      const y2 = y1 + radius * Math.sin(roundRadianToNearest10);
      lastLine.set('x2', x2);
      lastLine.set('y2', y2);
    } else {
      lastLine.set('x2', e.absolutePointer.x);
      lastLine.set('y2', e.absolutePointer.y);
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
