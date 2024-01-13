import { Divider, Modal } from 'antd';
import { useRef } from 'react';
import FacilityPositionManagement from './facility-position-management';

interface ComponentProps {
  mapId: string;
  open: boolean;
  facility: any;
  iconUrl: string;
  onCancel: () => void;
  onOk: (data) => void;
}

export default function FacilityPositionManagementModal({
  mapId,
  open,
  facility,
  iconUrl,
  onCancel,
  onOk,
}: ComponentProps) {
  const facilityData = useRef();
  return (
    <Modal
      destroyOnClose
      title="위치 설정"
      width={1200}
      okText="저장"
      cancelText="취소"
      open={open}
      onOk={() => {
        onOk(facilityData.current);
        onCancel();
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <Divider />
      <FacilityPositionManagement
        mapId={mapId}
        facility={facility}
        iconUrl={iconUrl}
        onChange={(data) => {
          facilityData.current = data;
        }}
      />
    </Modal>
  );
}
