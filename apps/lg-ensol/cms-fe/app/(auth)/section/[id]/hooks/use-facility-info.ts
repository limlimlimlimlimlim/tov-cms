import { useCallback, useContext } from 'react';
import { SectionContext } from '../section-context';

const useFaciltyInfo = () => {
  const { setHoverFacility, addFacility, showFacilityDetail } =
    useContext<any>(SectionContext);

  const addSection = useCallback(
    (sec, useClick = false) => {
      sec.on('onfacility', (facility) => {
        setHoverFacility(facility);
      });

      sec.on('outfacility', () => {
        setHoverFacility(null);
      });

      sec.on('addfacility', (id) => {
        addFacility(id);
      });

      if (useClick) {
        sec.on('facilitydetail', (facility) => {
          showFacilityDetail(facility, 'sec');
        });
      }
    },
    [addFacility, setHoverFacility, showFacilityDetail],
  );

  return {
    addSection,
  };
};

export default useFaciltyInfo;
