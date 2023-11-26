import { useCallback, useState } from 'react';

const useViewMode = () => {
  const [layer, setLayer] = useState<any>();

  const init = useCallback((l) => {
    setLayer(l);
  }, []);

  const render = useCallback(
    (sections) => {
      if (!layer) return;
      layer.destroyChildren();
      sections.forEach((s: any) => {
        const poly: any = new window.Konva.Line({
          points: s.path.split(','),
          fill: '#aaff77',
          closed: true,
          opacity: 0.5,
          name: s.id,
        });
        layer.add(poly);
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
