import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { updateSectionById } from '../../../api/section';
import { createSection } from '../../../util/section-renderer';

const useEditMode = () => {
  const sections = useRef();
  const mapId = useRef<any>();
  const stage = useRef<any>();
  const layer = useRef<any>();
  const scale = useRef<number>(1);
  const polygons = useRef<any[]>([]);
  const targetPolygons = useRef<any>({});
  const selectedPolygon = useRef<any>();
  const points = useRef<any[]>([]);
  const selectedPolygonAttrs = useRef<any>({});

  const init = useCallback((mid, stg, lay, sca) => {
    mapId.current = mid;
    stage.current = stg;
    layer.current = lay;
    scale.current = sca;
  }, []);

  const renderPolygon = useCallback(() => {
    selectedPolygon.current.setPoints([
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
        radius: 4,
        fill: '#ff9900',
        opacity: 0.5,
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

  const destroySelectedPolygon = useCallback(() => {
    if (selectedPolygon.current) {
      selectedPolygon.current.fill(selectedPolygonAttrs.current.fill);
      selectedPolygon.current.stroke(selectedPolygonAttrs.current.stroke);
      selectedPolygon.current.strokeWidth(
        selectedPolygonAttrs.current.strokeWidth,
      );
      selectedPolygon.current.opacity(selectedPolygonAttrs.current.opacity);
      selectedPolygon.current = null;
    }
  }, []);

  const initEvent = useCallback(() => {
    polygons.current.forEach((p) => {
      p.on('click', () => {
        const id = p.getName();

        destroySelectedPolygon();

        if (selectedPolygon.current !== p) {
          stage.current.off('click');
        }

        for (let i = points.current.length - 1; i >= 0; i -= 1) {
          removePoint(points.current[i]);
        }
        const path = p.getPoints();
        targetPolygons.current[id] = p;
        selectedPolygon.current = p;
        selectedPolygonAttrs.current = { ...p.attrs };
        selectedPolygon.current.fill('#aaff77');
        selectedPolygon.current.stroke('#555');
        selectedPolygon.current.strokeWidth(2);
        selectedPolygon.current.opacity(0.5);
        for (let i = 0, count = path.length; i < count; i += 2) {
          addPoint(path[Number(i)], path[Number(i) + 1]);
        }

        setTimeout(() => {
          if (!stage.current) return;
          stage.current.on('click', (e: any) => {
            if (points.current.length === 0) {
              addPoint(e.evt.layerX - 50, e.evt.layerY - 50);
              addPoint(e.evt.layerX + 50, e.evt.layerY - 50);
              addPoint(e.evt.layerX + 50, e.evt.layerY + 50);
              addPoint(e.evt.layerX - 50, e.evt.layerY + 50);
            } else {
              addPoint(e.evt.layerX, e.evt.layerY);
            }
          });
        }, 500);
      });
    });
  }, [destroySelectedPolygon, removePoint, addPoint]);

  const render = useCallback(
    (sections, options?) => {
      targetPolygons.current = {};
      polygons.current = createSection(
        sections,
        layer.current,
        scale.current,
        options,
      );
    },
    [layer],
  );

  const setup = useCallback(
    (s, o?) => {
      sections.current = s;
      render(sections.current, o);
      initEvent();
    },
    [initEvent, render],
  );

  const clear = useCallback(() => {
    layer.current.destroyChildren();
    destroySelectedPolygon();
    targetPolygons.current = {};
    polygons.current = [];
  }, [destroySelectedPolygon]);

  const apply = useCallback(async () => {
    await Promise.all(
      Object.values(polygons.current).map((p) => {
        return updateSectionById(
          p.getName(),
          mapId.current,
          p
            .getPoints()
            .map((p) => p / scale.current)
            .join(','),
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

export default useEditMode;
