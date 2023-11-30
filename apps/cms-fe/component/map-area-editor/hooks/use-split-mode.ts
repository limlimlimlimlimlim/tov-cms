import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { deleteSectionGroup } from '../../../api/section';

const useSplitMode = () => {
  const sections = useRef<any[]>([]);
  const mapId = useRef<any>();
  const stage = useRef<any>();
  const layer = useRef<any>();
  const polygons = useRef<any[]>([]);
  const targetPolygons = useRef<any>({});

  const init = useCallback((mid, s, l) => {
    mapId.current = mid;
    stage.current = s;
    layer.current = l;
  }, []);

  const getGroupId = useCallback(
    (sectionId) => {
      const sec = sections.current.find((sec) => sec.id === sectionId);
      return sec.groupId;
    },
    [sections],
  );

  const initEvent = useCallback(() => {
    polygons.current.forEach((p) => {
      p.on('click', () => {
        const id = p.getName();
        const groupId = getGroupId(id);
        if (!groupId) return;
        if (targetPolygons[id]) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete targetPolygons.current[groupId];
          p.fill('#aaff77');
        } else {
          targetPolygons.current[groupId] = true;
          p.fill('#ffaa22');
        }
      });
    });
  }, [getGroupId]);

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
  }, []);

  const apply = useCallback(async () => {
    await Promise.all(
      Object.keys(targetPolygons.current).map((target) => {
        return deleteSectionGroup(target);
      }),
    );

    void message.success('구역이 나누어졌습니다.');
    clear();
  }, [clear]);

  return {
    init,
    setup,
    clear,
    apply,
  };
};

export default useSplitMode;
