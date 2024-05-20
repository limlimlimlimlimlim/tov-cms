export const createSectionPoint = (x, y) => {
  return {
    x: Number(x),
    y: Number(y),
  };
};

export const pointToArray = (p) => {
  return [p.x, p.y];
};

export const pathToPoints = (p) => {
  const pItems = p.split(',');
  const results: any[] = [];
  for (let i = 0; i < pItems.length; i += 2) {
    results.push(createSectionPoint(pItems[i], pItems[i + 1]));
  }
  return results;
};

export const flatPath = (path) => {
  return [...path.map((p) => pointToArray(p)).flat()];
};
