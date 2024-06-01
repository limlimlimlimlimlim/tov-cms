import { Modal } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SectionContext } from '../../section-context';
import { getFacilityDetail } from '../../../../../../api/facility';
import FacilityForm from './facility-form';

const FacilityModal = () => {
  const { facilityDetailId, hideFacilityDetail } =
    useContext<any>(SectionContext);
  const [facilityDetail, setFacilityDetail] = useState();

  const fetchFacilityDetail = useCallback(async () => {
    const result = await getFacilityDetail(facilityDetailId);
    setFacilityDetail(result.data);
  }, [facilityDetailId]);

  useEffect(() => {
    if (!facilityDetailId) return;
    fetchFacilityDetail();
  }, [facilityDetailId, fetchFacilityDetail]);
  return (
    <Modal
      width={600}
      open={facilityDetailId}
      onCancel={() => {
        hideFacilityDetail();
      }}
      title={facilityDetailId ? '시설 상세' : '시설 등록'}
      footer={null}
    >
      <FacilityForm data={facilityDetail} />
    </Modal>
  );
};

export default FacilityModal;
