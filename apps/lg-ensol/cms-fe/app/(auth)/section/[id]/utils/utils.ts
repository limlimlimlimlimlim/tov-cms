declare const Konva: any;
interface SectionObjectOptions {
  fill: string;
  opacity: number;
  strokeWidth: number;
  stroke: string;
  strokeOpacity: number;
}

export const createSectionObject = (
  path,
  options: SectionObjectOptions = {
    fill: '#D2C60C',
    opacity: 0.3,
    strokeWidth: 1,
    stroke: '#D2C60C',
    strokeOpacity: 1,
  },
) => {
  const group = new Konva.Group({
    id: 'sectionGroup',
  });
  const poly = new Konva.Line({
    points: path,
    fill: options.fill,
    opacity: options.opacity,
    closed: true,
    id: 'section',
  });

  const stroke = new Konva.Line({
    points: path,
    fill: '',
    stroke: options.stroke,
    strokeWidth: options.strokeWidth,
    opacity: options.strokeOpacity,
    closed: true,
    id: 'sectionStroke',
  });

  group.add(poly, stroke);
  return group;
};

export const shiftMove = (x, y, relX, relY) => {
  const radian = Math.round(Math.atan2(relY - y, relX - x) * 10) / 10;
  const degree = (radian * 180) / Math.PI;
  const roundDgreeToNearest10 = roundToNearest(degree, 10);
  const roundRadianToNearest10 = (roundDgreeToNearest10 * Math.PI) / 180;
  const radius = Math.sqrt(Math.pow(relY - y, 2) + Math.pow(relX - x, 2));
  const newX = x + radius * Math.cos(roundRadianToNearest10);
  const newY = y + radius * Math.sin(roundRadianToNearest10);
  return {
    x: newX,
    y: newY,
  };
};

const roundToNearest = (value: number, nearest = 10) => {
  const remainder = value % nearest;
  if (remainder < nearest / 2) {
    return value - remainder;
  }
  return value + (nearest - remainder);
};

export const convertToKonvaOptions = (options) => {
  return {
    fill: options.color,
    opacity: options.alpha / 100,
    strokeWidth: options.strokeWidth,
    stroke: options.strokeColor,
    strokeOpacity: options.strokeAlpha / 100,
    closed: true,
  };
};
