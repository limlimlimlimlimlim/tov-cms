import { useContext, useEffect } from 'react';
import { SectionContext } from '../section-context';
import { createSectionObject, pathStringToArray } from '../utils/utils';
import { getSectionsByMapId } from '../../../../../api/section';

const useViewSection = () => {
  const { canvas } = useContext<any>(SectionContext);

  const render = (sections) => {
    sections.forEach((s) => {
      const sec = createSectionObject(pathStringToArray(s.path));
      canvas.add(sec);
    });

    canvas.requestRenderAll();
  };

  const fetch = async (id) => {
    const response = await getSectionsByMapId(id);
    render(response.data);
  };

  useEffect(() => {
    if (!canvas) return;
    return () => {
      canvas.remove(...canvas.getObjects());
    };
  }, [canvas]);

  return {
    fetch,
  };
};

export default useViewSection;
