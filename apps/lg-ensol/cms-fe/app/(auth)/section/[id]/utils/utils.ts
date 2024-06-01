import rgbHex from 'rgb-hex';
import hexRgb from 'hex-rgb';
import type Section from '../classes/section';

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

export const rgb2hex = (r, g, b) => {
  return `#${rgbHex(r, g, b)}`;
};

export const hex2rgb = (hex, a = 1) => {
  if (!hex) return;
  const { red, green, blue, alpha } = hexRgb(hex, { alpha: a } as any);
  return `rgba(${red},${green},${blue},${alpha})`;
};

export const convertColorParam = ({ r, g, b, a }) => {
  return {
    hex: rgb2hex(r, g, b),
    alpha: a,
    alphaPer: a * 100,
  };
};

export const generatePaintOptions = (section: Section) => {
  if (!section.options) return null;
  return {
    color: section.options.fill,
    alpha: section.options.opacity! * 100,
    strokeWidth: section.options.strokeWidth,
    strokeColor: section.options.stroke,
    strokeAlpha: section.options.strokeOpacity! * 100,
  };
};

export const generateFacilityOptions = (facility: any) => {
  return {
    fontSize: facility.fontSize,
    paddingTop: facility.paddingTop,
    paddingBottom: facility.paddingBottom,
    paddingRight: facility.paddingRight,
    paddingLeft: facility.paddingLeft,
    iconColor: facility.iconColor,
    tooltipColor: facility.tooltipColor,
  };
};
