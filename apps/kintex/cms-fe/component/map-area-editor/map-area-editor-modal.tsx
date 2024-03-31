import Modal from 'antd/es/modal/Modal';
import MapAreaEditor from './map-area-editor';

interface ComponentProps {
  map: any;
  open: boolean;
  onOk: (data?: any) => any;
  onCancel: () => void;
}

export default function MapAreaEditorModal({
  map,
  open,
  onCancel,
}: ComponentProps) {
  return (
    <Modal
      destroyOnClose
      width={1400}
      title="구역 설정"
      open={open}
      footer={null}
      onCancel={onCancel}
    >
      <MapAreaEditor map={map} />
    </Modal>
  );
}
