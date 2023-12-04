import { Modal } from 'antd';
import WingList from './wing-list';

interface ComponentProps {
  open: boolean;
  onCancel: () => void;
}

export default function BuldingInfoManagementModal({
  open,
  onCancel,
}: ComponentProps) {
  return (
    <Modal
      title="건물 정보 관리"
      open={open}
      cancelText="닫기"
      onCancel={onCancel}
    >
      <WingList />
    </Modal>
  );
}
