import { useCallback, useContext } from 'react';
import { SectionContext } from '../section-context';
import { createSectionObject, pathStringToArray } from '../utils/utils';
import { getSectionsByMapId } from '../../../../../api/section';

const useViewSection = () => {
  const { canvas } = useContext<any>(SectionContext);

  const render = useCallback(
    (sections) => {
      sections.forEach((s) => {
        const sec = createSectionObject(pathStringToArray(s.path));
        canvas.add(sec);
      });

      canvas.requestRenderAll();
    },
    [canvas],
  );

  const fetchSection = useCallback(
    async (id) => {
      const response = await getSectionsByMapId(id);
      render(response.data);
    },
    [render],
  );

  return {
    fetchSection,
  };
};

export default useViewSection;
