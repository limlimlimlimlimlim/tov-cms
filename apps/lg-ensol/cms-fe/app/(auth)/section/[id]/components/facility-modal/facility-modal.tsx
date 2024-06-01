import { Modal } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SectionContext } from '../../section-context';
import { getFacilityDetail } from '../../../../../../api/facility';
import FacilityForm from './facility-form';

const FacilityModal = () => {
  const {
    facilityDetailId,
    hideFacilityDetail,
    visibleFacilityDetail,
    openFacilityContainer,
    modalFrom,
  } = useContext<any>(SectionContext);
  const [facilityDetail, setFacilityDetail] = useState<any>();

  const fetchFacilityDetail = useCallback(async () => {
    const result = await getFacilityDetail(facilityDetailId);
    setFacilityDetail(result.data);
  }, [facilityDetailId]);

  useEffect(() => {
    if (!facilityDetailId) {
      setFacilityDetail(null);
      return;
    }
    if (facilityDetail) return;
    fetchFacilityDetail();
  }, [facilityDetail, facilityDetailId, fetchFacilityDetail]);

  useEffect(() => {
    return () => {
      setFacilityDetail(null);
    };
  }, []);

  return (
    <Modal
      width={600}
      open={visibleFacilityDetail}
      onCancel={() => {
        hideFacilityDetail();
        setFacilityDetail(null);
      }}
      destroyOnClose
      title={facilityDetailId ? '시설 상세' : '시설 등록'}
      footer={null}
    >
      <FacilityForm
        data={facilityDetail}
        onComplete={() => {
          hideFacilityDetail();
          setFacilityDetail(null);
          if (modalFrom === 'container') {
            openFacilityContainer();
          }
        }}
      />
    </Modal>
  );
};

export default FacilityModal;
