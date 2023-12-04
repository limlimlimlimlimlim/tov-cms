import { Divider, Modal } from 'antd';
import { useState } from 'react';
import FacilityPositionManagement from './facility-position-management';

interface ComponentProps {
  mapId: string;
  open: boolean;
  position: any;
  onCancel: () => void;
  onOk: (data) => void;
}

export default function FacilityPositionManagementModal({
  mapId,
  open,
  position,
  onCancel,
  onOk,
}: ComponentProps) {
  const [data, setData] = useState();
  return (
    <Modal
      destroyOnClose
      title="위치 설정"
      width={1200}
      okText="저장"
      cancelText="취소"
      open={open}
      onOk={() => {
        onOk(data);
        onCancel();
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <Divider />
      <FacilityPositionManagement
        mapId={mapId}
        position={position}
        onChange={(data) => {
          setData(data);
        }}
      />
    </Modal>
  );
}
