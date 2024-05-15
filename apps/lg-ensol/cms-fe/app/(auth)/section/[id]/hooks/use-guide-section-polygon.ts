import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { SectionContext } from '../section-context';

declare const fabric: any;
declare const Konva: any;

const useGuideSectionPolygon = (addSectionCallback) => {
  const { stage, canvas, size } = useContext<any>(SectionContext);
  const guidePoints = useRef<any[]>([]);
  const guideCircles = useRef<any[]>([]);
  const guideLines = useRef<any[]>([]);

  const guidelayer = useMemo(() => {
    const layer = new Konva.Layer();
    layer.setAttr('id', 'selectionLayer');
    return layer;
  }, []);

  const eventlayer = useMemo(() => {
    const layer = new Konva.Layer();
    layer.setAttr('id', 'eventLayer');
    return layer;
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
    guideCircles.current.forEach((c) => {
      c.remove();
    });
    guideLines.current.forEach((l) => {
      l.remove();
    });
    guideCircles.current = [];
    guideLines.current = [];
  }, []);

  const updateGuide = useCallback(() => {
    guideLine.points([...guidePoints.current.map((p) => p.toArray())].flat());
    const num = guidePoints.current.length - guideCircles.current.length;

    for (let i = 0; i < num; i += 1) {
      const c = new Konva.Circle({
        x: 0,
        y: 0,
        radius: 6,
        fill: 'yellow',
        stroke: 'black',
      });
      guidelayer.add(c);
      guideCircles.current.push(c);
    }
    guideCircles.current.forEach((p, index) => {
      const { x, y } = guidePoints.current[index];
      p.x(x);
      p.y(y);
    });
  }, [guideLine, guidelayer]);

  const onDbClickControlPoint = useCallback(
    (index) => {
      removePoint(index);
      updateGuide();
    },
    [updateGuide],
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
    const lines = createLines(guidePoints.current);
    guideLines.current = lines;

    const controlPoints = createControlPoints(guidePoints.current);
    guideCircles.current = controlPoints;
    addControlPointEvent(controlPoints);
  }, [addControlPointEvent, createControlPoints, createLines]);

  const end = useCallback(() => {
    if (!canvas) return;
    addSectionCallback({ path: guidePoints.current });
    guidePoints.current = [];
    canvas.remove(guideLine.current);
    removeGuidePolygons();
  }, [addSectionCallback, canvas, guideLine, removeGuidePolygons]);

  // TODO:
  // 마우스 좌표 보정 v
  // circle 생성 v
  // circle 삭제
  // 런타임 오류들 확인
  // bg 로드 후 실행 v

  const startPoint = (x, y) => {
    const p = point(x, y);
    const guidePoint = point(x, y);
    guidePoints.current.push(p, guidePoint);
  };

  const addPoint = (x, y) => {
    guidePoints.current.push(point(x, y));
  };

  const removePoint = (index) => {
    guidePoints.current.splice(index, 1);
  };

  const updatePoint = (index, x, y) => {
    guidePoints.current[index] = point(x, y);
  };

  const lastPoint = () => {
    return guidePoints.current[guidePoints.current.length - 1];
  };

  const onMouseDown = useCallback(
    (e) => {
      if (!stage) return;
      if (e.evt.altKey) return;
      const { x, y } = eventlayer.getRelativePointerPosition();
      const last = lastPoint();

      if (last) {
        updatePoint(guidePoints.current.length - 1, last.x, last.y);
        addPoint(last.x, last.y);
      } else {
        startPoint(x, y);
      }
      updateGuide();
    },
    [eventlayer, stage, updateGuide],
  );

  const onMouseMove = useCallback(
    (e) => {
      const { shiftKey } = e.evt;
      const { x: relX, y: relY } = eventlayer.getRelativePointerPosition();
      const last = lastPoint();
      if (!last) return;
      let newX = 0;
      let newY = 0;
      if (guidePoints.current.length === 0) return;
      if (shiftKey) {
        const { x, y } = guidePoints.current[guidePoints.current.length - 2];
        const radian = Math.round(Math.atan2(relY - y, relX - x) * 10) / 10;

        const degree = (radian * 180) / Math.PI;
        const roundDgreeToNearest10 = roundToNearest(degree, 30);
        const roundRadianToNearest10 = (roundDgreeToNearest10 * Math.PI) / 180;
        const radius = Math.sqrt(Math.pow(relY - y, 2) + Math.pow(relX - x, 2));
        newX = x + radius * Math.cos(roundRadianToNearest10);
        newY = y + radius * Math.sin(roundRadianToNearest10);
      } else {
        newX = relX;
        newY = relY;
      }
      updatePoint(guidePoints.current.length - 1, newX, newY);
      updateGuide();
    },
    [eventlayer, updateGuide],
  );

  const initLayers = useCallback(() => {
    if (!stage) return;
    stage.add(guidelayer);
    stage.add(eventlayer);
    const eventArea = new Konva.Rect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      fill: 'green',
      opacity: 0.3,
    });
    eventlayer.add(eventArea);
    eventlayer.moveToTop();
  }, [eventlayer, guidelayer, stage]);

  const initEvents = useCallback(() => {
    if (!stage) return;
    eventlayer.on('mousedown', onMouseDown);
    eventlayer.on('mousemove', onMouseMove);
  }, [eventlayer, onMouseDown, onMouseMove, stage]);

  const init = useCallback(() => {
    stage.add(guidelayer);
    guidelayer.add(guideLine);
  }, [guideLine, guidelayer, stage]);

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
    initLayers();
    initEvents();
    return () => {
      guidelayer.remove();
      eventlayer.off('mousedown');
      eventlayer.off('mousemove');
      removeGuidePolygons();
      guideLine.remove();
      guidePoints.current = [];
    };
  }, [
    canvas,
    guideLine,
    init,
    initEvents,
    guidelayer,
    removeGuidePolygons,
    stage,
    initLayers,
    eventlayer,
  ]);

  useEffect(() => {
    if (size.width === 0 || size.height === 0) return;
    eventlayer.children[0].width(size.width);
    eventlayer.children[0].height(size.width);
  }, [eventlayer, eventlayer.children, size]);
};

export default useGuideSectionPolygon;

const point = (x, y) => {
  return {
    x,
    y,
    toArray() {
      return [x, y];
    },
  };
};
