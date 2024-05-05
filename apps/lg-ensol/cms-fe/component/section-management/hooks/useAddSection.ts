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
    console.log(currentPolygonPoints);
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
    console.log('mouse:down');
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
      fill: '',
      stroke: 'green',
      strokeWidth: 3,
      left: x,
      top: y,
      originX: 'center',
      originY: 'center',
      selectable: false,
    });
    currentPolygonPoints.current.push(circle);
    canvas.current.add(circle);

    const line = new fabric.Line([], {
      stroke: 'blue',
      strokeWidth: 2,
      selectable: false,
    });
    currentPolygonLines.current.push(line);
    canvas.current.add(line);

    canvas.current.on('mouse:up', onMouseMove);
  };

  const onMouseMove = () => {};

  const onMouseUp = () => {};

  const destory = () => {};

  return {
    init,
    destory,
  };
};

export default useAddSection;
