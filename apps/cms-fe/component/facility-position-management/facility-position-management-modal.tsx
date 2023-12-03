import { Divider, Modal } from 'antd';
import { useState } from 'react';
import FacilityPositionManagement from './facility-position-management';

interface ComponentProps {
  mapId: string;
  open: boolean;
  onCancel: () => void;
  onOk: (data) => void;
}

export default function FacilityPositionManagementModal({
  mapId,
  open,
  onCancel,
  onOk,
}: ComponentProps) {
  const [data, setData] = useState();
  return (
    <Modal
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
        onChange={(data) => {
          setData(data);
        }}
      />
    </Modal>
  );
}
