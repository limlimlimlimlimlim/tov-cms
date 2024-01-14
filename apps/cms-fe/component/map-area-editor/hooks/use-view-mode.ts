import { useCallback, useRef } from 'react';
import { createSection } from '../../../util/section-renderer';

const useViewMode = () => {
  const layer = useRef<any>();
  const scale = useRef<number>(1);

  const init = useCallback((lay, sca) => {
    layer.current = lay;
    scale.current = sca;
  }, []);

  const render = useCallback((sections) => {
    createSection(sections, layer.current, scale.current);
  }, []);

  return {
    init,
    render,
  };
};

export default useViewMode;
