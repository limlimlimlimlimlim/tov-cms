import Modal from "antd/es/modal/Modal";
import MapAreaEditor from "./map-area-editor";

interface ComponentProps {
  id: string;
  open: boolean;
  onOk: (data: any) => void;
  onCancel: () => void;
}

export default function MapAreaEditorModal({
  id,
  open,
  onOk,
  onCancel,
}: ComponentProps) {
  return (
    <Modal
      width={1400}
      title="구역 설정"
      okText="저장"
      cancelText="취소"
      open={open}
      onOk={() => {
        onOk({});
      }}
      onCancel={onCancel}
    >
      <MapAreaEditor id={id} />
    </Modal>
  );
}
