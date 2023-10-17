import { Modal } from "antd";
import FacilityPositionManagement from "./facility-position-management";

interface ComponentProps {
  open: boolean;
  onCancel: () => void;
}

export default function FacilityPositionManagementModal({
  open,
  onCancel,
}: ComponentProps) {
  return (
    <Modal
      title="위치 설정"
      width={1000}
      okText="저장"
      cancelText="취소"
      open={open}
      onCancel={() => {
        onCancel();
      }}
    >
      <FacilityPositionManagement />
    </Modal>
  );
}
