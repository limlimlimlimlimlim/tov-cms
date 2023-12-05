const colors = ['#9900ff', '#00ff99', '#ff0099', '#99ff00', '#0099ff'];

const createSection = (sections, layer, scale) => {
  if (!layer) return;
  const polygons: any[] = [];
  const groupColors = [...colors];
  const groups = {};
  const normals = {
    color: '#aaff77',
    sections: [] as any[],
  };
  const disabled = {
    color: '#eeeeee',
    sections: [] as any[],
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

  layer.destroyChildren();
  normals.sections.forEach((s: any) => {
    const poly = createPolygon(s, normals.color, scale);
    polygons.push(poly);
    layer.add(poly);
  });

  disabled.sections.forEach((s: any) => {
    const poly = createPolygon(s, disabled.color, scale);
    polygons.push(poly);
    layer.add(poly);
  });

  Object.values(groups).forEach((g: any) => {
    g.sections.forEach((s) => {
      const poly = createPolygon(s, g.color, scale);
      polygons.push(poly);
      layer.add(poly);
    });
  });

  return polygons;
};

const createPolygon = (s, color, scale) => {
  return new window.Konva.Line({
    points: s.path.split(',').map((p) => parseFloat(p) * scale),
    fill: color,
    closed: true,
    opacity: 0.5,
    name: s.id,
  });
};

export { createSection };
