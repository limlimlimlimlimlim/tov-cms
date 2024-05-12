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
