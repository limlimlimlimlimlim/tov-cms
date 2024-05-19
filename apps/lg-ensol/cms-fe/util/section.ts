export const createSectionPoint = (x, y) => {
  return {
    x,
    y,
  };
};

export const pointToArray = (p) => {
  return [p.x, p.y];
};

export const flatPath = (path) => {
  return [...path.map((p) => pointToArray(p)).flat()];
};
