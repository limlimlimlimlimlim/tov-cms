import { useCallback, useRef } from 'react';
import { updateSectionById } from '../../../api/section';
import { message } from 'antd';

const useDeleteMode = () => {
  const sections = useRef();
  const mapId = useRef<any>();
  const stage = useRef<any>();
  const layer = useRef<any>();
  const polygons = useRef<any[]>([]);
  const targetPolygons = useRef<any>({});
  const editPolygon = useRef<any>();
  const points = useRef<any[]>([]);

  const init = useCallback((mid, s, l) => {
    mapId.current = mid;
    stage.current = s;
    layer.current = l;
  }, []);

  const renderPolygon = useCallback(() => {
    editPolygon.current.setPoints([
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

      c.on('dragmove', (e) => {
        c.setX(e.evt.layerX);
        c.setY(e.evt.layerY);
        renderPolygon();
      });
    },
    [removePoint, renderPolygon],
  );

  const initEvent = useCallback(() => {
    polygons.current.forEach((p) => {
      p.on('click', () => {
        const id = p.getName();
        editPolygon.current = null;
        for (let i = points.current.length - 1; i >= 0; i -= 1) {
          removePoint(points.current[i]);
        }
        const path = p.getPoints();
        targetPolygons.current[id] = p;
        editPolygon.current = p;
        for (let i = 0, count = path.length; i < count; i += 2) {
          addPoint(path[Number(i)], path[Number(i) + 1]);
        }
      });
    });
  }, [addPoint, removePoint, points]);

  const render = useCallback(
    (sections) => {
      if (!layer.current) return;
      layer.current.destroyChildren();
      sections.forEach((s: any) => {
        const poly: any = new window.Konva.Line({
          points: s.path.split(','),
          fill: '#aaff77',
          closed: true,
          opacity: 0.5,
          name: s.id,
        });
        layer.current.add(poly);
        polygons.current.push(poly);
      });
    },
    [layer],
  );

  const setup = useCallback(
    (s) => {
      sections.current = s;
      render(sections.current);
      initEvent();
    },
    [initEvent, render],
  );

  const clear = useCallback(() => {
    layer.current.destroyChildren();
    targetPolygons.current = {};
    polygons.current = [];
  }, []);

  const apply = useCallback(async () => {
    await Promise.all(
      Object.values(polygons.current).map((p) => {
        return updateSectionById(
          p.getName(),
          mapId.current,
          p.getPoints().join(','),
        );
      }),
    );
    void message.success('구역이 수정됐습니다.');
    clear();
  }, [clear]);

  return {
    init,
    setup,
    clear,
    apply,
  };
};

export default useDeleteMode;
