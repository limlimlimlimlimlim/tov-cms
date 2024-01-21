import { useCallback, useRef } from 'react';
import { message } from 'antd';
import { createSectionGroup } from '../../../api/section';
import { createSection } from '../../../util/section-renderer';

const useMergeMode = () => {
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
          void message.warning('이미 병합된 구역입니다.');
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
    await createSectionGroup(Object.keys(targetPolygons.current));
    void message.success('구역이 병합됐습니다.');
    clear();
  }, [clear]);

  const validate = useCallback(() => {
    const keys = Object.keys(targetPolygons.current);
    const valid = keys.length >= 2;
    return { valid, msg: !valid ? '2개 구역 이상 선택해주세요.' : '' };
  }, []);

  return {
    init,
    setup,
    clear,
    apply,
    validate,
  };
};

export default useMergeMode;
