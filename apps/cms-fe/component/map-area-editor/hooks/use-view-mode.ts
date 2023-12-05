import { useCallback, useRef } from 'react';

const useViewMode = () => {
  const layer = useRef<any>();
  const scale = useRef<number>(1);

  const init = useCallback((lay, sca) => {
    layer.current = lay;
    scale.current = sca;
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
      });
    },
    [layer],
  );

  return {
    init,
    render,
  };
};

export default useViewMode;
