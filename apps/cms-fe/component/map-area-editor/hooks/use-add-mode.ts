import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { addSection } from '../../../api/section';

const useAddMode = () => {
  const sections = useRef();
  const mapId = useRef<any>();
  const stage = useRef<any>();
  const layer = useRef<any>();
  const points = useRef<any[]>([]);
  const addPloygon = useRef<any>(null);

  const init = useCallback((mid, s, l) => {
    mapId.current = mid;
    stage.current = s;
    layer.current = l;
  }, []);

  const renderPolygon = useCallback(() => {
    addPloygon.current.setPoints([
      ...points.current.map((p: any) => [p.getX(), p.getY()]).flat(),
    ]);
  }, []);

  const removePoint = useCallback((p) => {
    p.remove();
    points.current.splice(points.current.indexOf(p), 1);
    p.off('click');
    p.off('dragmove');
  }, []);

  const addPoint = useCallback(
    (x, y) => {
      const c: any = new window.Konva.Circle({
        x,
        y,
        radius: 6,
        fill: '#ff9900',
        draggable: true,
      });
      points.current.push(c);
      renderPolygon();
      layer.current.add(c);

      c.on('click', () => {
        removePoint(c);
        renderPolygon();
      });

      c.on('dragmove', () => {
        renderPolygon();
      });
    },
    [removePoint, renderPolygon],
  );

  const initEvent = useCallback(() => {
    if (!stage.current) return;
    stage.current.off('click');
    stage.current.on('click', (e: any) => {
      addPoint(e.evt.layerX, e.evt.layerY);
    });
  }, [addPoint]);

  const initAddPolygon = useCallback(() => {
    const poly: any = new window.Konva.Line({
      points: [],
      fill: '#aaff77',
      closed: true,
      opacity: 0.5,
    });
    setTimeout(() => layer.current.add(poly), 0);
    addPloygon.current = poly;
  }, [layer]);

  const render = useCallback(
    (sections) => {
      if (!layer.current) return;
      layer.current.destroyChildren();
      points.current = [];

      layer.current.add(
        new window.Konva.Line({
          points: [],
          fill: '#aaff77',
          closed: true,
          opacity: 0.5,
        }),
      );

      sections.forEach((s: any) => {
        const poly: any = new window.Konva.Line({
          points: s.path.split(','),
          fill: '#aaff77',
          closed: true,
          opacity: 0.3,
          name: s.id,
        });
        layer.current.add(poly);
      });
    },
    [layer],
  );

  const setup = useCallback(
    (s) => {
      sections.current = s;
      initAddPolygon();
      initEvent();
      render(sections.current);
    },
    [initAddPolygon, initEvent, render],
  );

  const clear = useCallback(() => {
    stage.current.off('click');
    addPloygon.current.remove();
    points.current = [];
    layer.current.destroyChildren();
  }, []);

  const apply = useCallback(async () => {
    const path = points.current
      .map((p) => {
        return [p.getX(), p.getY()];
      })
      .flat()
      .join(',');
    points.current.forEach((p) => p.remove());
    await addSection(mapId.current, path);
    void message.success('구역이 생성됐습니다.');
    clear();
  }, [clear]);

  return {
    init,
    setup,
    clear,
    apply,
  };
};

export default useAddMode;
