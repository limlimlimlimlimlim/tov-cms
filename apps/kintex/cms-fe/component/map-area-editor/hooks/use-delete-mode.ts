import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { deleteSectionById } from '../../../api/section';
import { createSection } from '../../../util/section-renderer';

const useDeleteMode = () => {
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
        if (groupId !== null) {
          void message.warning('병합을 먼저 해제해주세요.');
          return;
        }
        if (targetPolygons.current[id]) {
          delete targetPolygons.current[id];
          p.stroke(null);
          p.strokeWidth(0);
        } else {
          targetPolygons.current[id] = true;
          p.stroke('red');
          p.strokeWidth(4);
        }
      });
    });
  }, [getGroupId]);

  const render = useCallback(
    (sections) => {
      targetPolygons.current = {};
      polygons.current = createSection(sections, layer.current, scale.current);
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
      Object.keys(targetPolygons.current).map((p) => {
        return deleteSectionById(p);
      }),
    );
    void message.success('구역이 삭제됐습니다.');
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
