const colors = ['#9900ff', '#00ff99', '#ff0099', '#99ff00', '#0099ff'];

const createSection = (sections, layer, scale, options?) => {
  if (!layer) return [];
  const polygons: any[] = [];
  const groupColors = [...colors];
  const groups = {};

  const normals = {
    color: '#aaff77',
    sections: [] as any[],
  };
  const disabled = {
    color: '#000000',
    sections: [] as any[],
  };

  const hasFacility = {
    color: '#00000',
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

    if (s.facilities.length) {
      hasFacility.sections.push(s);
    }
  });

  layer.destroyChildren();
  normals.sections.forEach((s: any) => {
    const poly = createPolygon(s, options?.color || s.color, scale, {
      ...s,
      ...options,
    });
    polygons.push(poly);
    layer.add(poly);
  });

  disabled.sections.forEach((s: any) => {
    const poly = createPolygon(s, options?.color || disabled.color, scale);
    polygons.push(poly);
    layer.add(poly);
  });

  Object.values(groups).forEach((g: any) => {
    g.sections.forEach((s) => {
      const poly = createPolygon(
        s,
        options?.color || options?.showGroup ? g.color : s.color,
        scale,
        { ...s, ...options },
      );
      polygons.push(poly);
      layer.add(poly);
    });
  });

  hasFacility.sections.forEach((s: any) => {
    const facility = s.facilities[0];
    const marker = new window.Konva.Circle({
      radius: 20 * scale,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2,
      x: facility.x * scale,
      y: facility.y * scale,
    });
    layer.add(marker);
  });

  return polygons;
};

const createPolygon = (
  s,
  color,
  scale,
  options?: { strokeColor?; strokeWidth?; alpha? },
) => {
  return new window.Konva.Line({
    points: s.path.split(',').map((p) => parseFloat(p) * scale),
    fill: color,
    stroke: options?.strokeColor !== undefined ? options.strokeColor : '#555',
    strokeWidth: options?.strokeWidth !== undefined ? options.strokeWidth : 2,
    closed: true,
    opacity: options?.alpha !== undefined ? options.alpha * 0.01 : 0.3,
    name: s.id,
  });
};

export { createSection };
