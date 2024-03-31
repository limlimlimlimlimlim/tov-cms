import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { disableSectionById } from '../../../api/section';
import { createSection } from '../../../util/section-renderer';

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

  const getGroupId = useCallback(
    (sectionId) => {
      const sec = sections.current.find((sec) => sec.id === sectionId);
      return sec.groupId;
    },
    [sections],
  );

  const isDisabled = useCallback(
    (sectionId) => {
      const sec = sections.current.find((sec) => sec.id === sectionId);
      return sec.disabled;
    },
    [sections],
  );

  const initEvent = useCallback(() => {
    polygons.current.forEach((p) => {
      p.on('click', () => {
        const id = p.getName();
        const groupId = getGroupId(id);
        if (groupId !== null) {
          void message.warning('구역을 먼저 나누어주세요.');
          return;
        }

        const disabled = isDisabled(id);

        if (disabled) {
          void message.warning('이미 비활성된 구역입니다.');
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
  }, [getGroupId, isDisabled]);

  const render = useCallback((sections) => {
    targetPolygons.current = {};
    polygons.current = createSection(sections, layer.current, scale.current, {
      showGroup: true,
    }) as any;
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
