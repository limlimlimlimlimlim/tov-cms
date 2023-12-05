import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { disableSectionById } from '../../../api/section';

const useDisableMode = () => {
  const sections = useRef<any[]>([]);
  const mapId = useRef<any>();
  const stage = useRef<any>();
  const layer = useRef<any>();
  const scale = useRef<number>(1);
  const polygons = useRef<any[]>([]);
  const targetPolygons = useRef<any>({});

  const init = useCallback((mid, stg, lay, sca) => {
    mapId.current = mid;
    stage.current = stg;
    layer.current = lay;
    scale.current = sca;
  }, []);

  const initEvent = useCallback(() => {
    polygons.current.forEach((p) => {
      p.on('click', () => {
        const id = p.getName();
        if (targetPolygons[id]) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete targetPolygons.current[id];
          p.fill('#aaff77');
        } else {
          targetPolygons.current[id] = true;
          p.fill('#ffaa22');
        }
      });
    });
  }, []);

  const render = useCallback(
    (sections) => {
      if (!layer.current) return;
      layer.current.destroyChildren();

      sections.forEach((s: any) => {
        const poly: any = new window.Konva.Line({
          points: s.path.split(',').map((p) => parseFloat(p) * scale.current),
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
  }, []);

  const apply = useCallback(async () => {
    await Promise.all(
      Object.keys(targetPolygons.current).map((target) => {
        return disableSectionById(target);
      }),
    );

    void message.success('구역이 비활성화 되었습니다.');
    clear();
  }, [clear]);

  return {
    init,
    setup,
    clear,
    apply,
  };
};

export default useDisableMode;
