import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { deleteSectionGroup } from '../../../api/section';
import { createSection } from '../../../util/section-renderer';

const useSplitMode = () => {
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

  const getGroupId = useCallback(
    (sectionId) => {
      const sec = sections.current.find((sec) => sec.id === sectionId);
      return sec.groupId;
    },
    [sections],
  );

  const initEvent = useCallback(() => {
    polygons.current.forEach((p) => {
      const id = p.getName();
      const groupId = getGroupId(id);
      p.on('click', () => {
        if (!groupId) {
          void message.warning('병합된 구역만 선택 가능합니다.');
          return;
        }
        if (targetPolygons.current[groupId]) {
          delete targetPolygons.current[groupId];
          polygons.current
            .filter((p) => getGroupId(p.getName()) === groupId)
            .forEach((p) => {
              p.stroke(null);
              p.strokeWidth(0);
            });
        } else {
          targetPolygons.current[groupId] = true;
          polygons.current
            .filter((p) => getGroupId(p.getName()) === groupId)
            .forEach((p) => {
              p.stroke('red');
              p.strokeWidth(4);
            });
        }
      });
    });
  }, [getGroupId]);

  const render = useCallback((sections) => {
    targetPolygons.current = {};
    polygons.current = createSection(sections, layer.current, scale.current)!;
  }, []);

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
