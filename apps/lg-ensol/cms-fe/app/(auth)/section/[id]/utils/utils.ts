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
  const group = new Konva.Group();
  const poly = new Konva.Line({
    points: path,
    fill: options.fill,
    opacity: options.opacity,
    closed: true,
  });

  const stroke = new Konva.Line({
    points: path,
    fill: '',
    stroke: options.stroke,
    strokeWidth: options.strokeWidth,
    opacity: options.strokeOpacity,
    closed: true,
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
