import { useRef, useState } from 'react';

declare const fabric: any;

const useTargetSectionPolygon = () => {
  const render = (polygons) => {
    console.log(polygons);
  };
  return {
    render,
  };
};

export default useTargetSectionPolygon;
