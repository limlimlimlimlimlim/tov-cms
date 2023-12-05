import { useCallback, useRef } from 'react';

const colors = ['#9900ff', '#00ff99', '#ff0099', '#99ff00', '#0099ff'];

const useViewMode = () => {
  const layer = useRef<any>();
  const scale = useRef<number>(1);

  const init = useCallback((lay, sca) => {
    layer.current = lay;
    scale.current = sca;
  }, []);

  const addPolygon = useCallback((s, color) => {
    const poly: any = new window.Konva.Line({
      points: s.path.split(',').map((p) => parseFloat(p) * scale.current),
      fill: color,
      closed: true,
      opacity: 0.5,
      name: s.id,
    });
    layer.current.add(poly);
  }, []);

  const render = useCallback(
    (sections) => {
      if (!layer.current) return;
      const groupColors = [...colors];
      const groups = {};
      const normals = {
        color: '#aaff77',
        sections: [],
      };
      const disabled = {
        color: '#eeeeee',
        sections: [],
      };
      sections.forEach((s: any) => {
        if (s.groupId) {
          if (!groups[s.groupId]) {
            groups[s.groupId] = {
              color: groupColors.shift(),
              sections: [],
            };
          }
          groups[s.groupId].sections.push(s);
        } else if (s.disabled) {
          disabled.sections.push(s);
        } else {
          normals.sections.push(s);
        }
      });

      layer.current.destroyChildren();
      normals.sections.forEach((s: any) => {
        addPolygon(s, normals.color);
      });

      disabled.sections.forEach((s: any) => {
        addPolygon(s, disabled.color);
      });

      Object.values(groups).forEach((g: any) => {
        g.sections.forEach((s) => {
          addPolygon(s, g.color);
        });
      });
    },
    [addPolygon],
  );

  return {
    init,
    render,
  };
};

export default useViewMode;
