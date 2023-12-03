import { Divider, Modal } from 'antd';
import FacilityPositionManagement from './facility-position-management';

interface ComponentProps {
  mapId: string;
  open: boolean;
  onCancel: () => void;
}

export default function FacilityPositionManagementModal({
  mapId,
  open,
  onCancel,
}: ComponentProps) {
  return (
    <Modal
      title="위치 설정"
      width={1200}
      okText="저장"
      cancelText="취소"
      open={open}
      onCancel={() => {
        onCancel();
      }}
    >
      <Divider />
      <FacilityPositionManagement mapId={mapId} />
    </Modal>
  );
}
