declare const fabric: any;

interface SectionObjectOptions {
  fill: string;
  opacity: number;
  strokeWidth: number;
  stroke: string;
  strokeOpacity: number;
}

export const pathStringToArray = (path) => {
  const arr: string[] = path.split(',');
  const result: { x: number; y: number }[] = [];

  for (let i = 0; i < arr.length; i += 2) {
    result.push({ x: Number(arr[i]), y: Number(arr[i + 1]) });
  }

  return result;
};

export const createSectionObject = (
  path,
  options: SectionObjectOptions = {
    fill: '#D2C60C',
    opacity: 0.3,
    strokeWidth: 5,
    stroke: '#D2C60C',
    strokeOpacity: 0.3,
  },
) => {
  const section = new fabric.Polygon(path, {
    fill: options.fill,
    opacity: options.opacity,
  });

  const stroke = new fabric.Polygon(path, {
    strokeWidth: options.strokeWidth,
    stroke: options.stroke,
    opacity: options.strokeOpacity,
    fill: '',
    strokeLineCap: 'round',
    strokeLineJoin: 'bevel',
  });
  const g = new fabric.Group([section, stroke], { selectable: false });
  return g;
};
