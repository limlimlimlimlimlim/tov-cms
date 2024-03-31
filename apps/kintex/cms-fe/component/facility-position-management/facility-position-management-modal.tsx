import { Divider, Modal } from 'antd';
import { useRef } from 'react';
import FacilityPositionManagement from './facility-position-management';

interface ComponentProps {
  mapId: string;
  open: boolean;
  facility: any;
  iconUrl: string;
  mapSections: any[];
  onCancel: () => void;
  onOk: (data) => void;
  onChangeSection: () => void;
}

export default function FacilityPositionManagementModal({
  mapId,
  open,
  facility,
  mapSections,
  iconUrl,
  onCancel,
  onOk,
  onChangeSection,
}: ComponentProps) {
  const facilityData = useRef<any>();

  return (
    <Modal
      destroyOnClose
      title="위치 설정"
      width={1200}
      okText="적용"
      cancelText="취소"
      open={open}
      onOk={() => {
        onOk(facilityData.current);
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <Divider />
      <FacilityPositionManagement
        mapId={mapId}
        facility={facility}
        mapSections={mapSections}
        iconUrl={iconUrl}
        onChange={(data) => {
          facilityData.current = data;
        }}
        onChangeSection={onChangeSection}
      />
    </Modal>
  );
}
