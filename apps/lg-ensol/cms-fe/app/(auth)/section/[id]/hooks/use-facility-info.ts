import { useCallback, useContext } from 'react';
import { SectionContext } from '../section-context';

const useFaciltyInfo = () => {
  const { setHoverFacility, addFacility } = useContext<any>(SectionContext);

  const addSection = useCallback(
    (sec) => {
      sec.on('onfacility', (facility) => {
        setHoverFacility(facility);
      });

      sec.on('outfacility', () => {
        setHoverFacility(null);
      });

      sec.on('addfacility', (id) => {
        addFacility(id);
      });
    },
    [addFacility, setHoverFacility],
  );

  return {
    addSection,
  };
};

export default useFaciltyInfo;
