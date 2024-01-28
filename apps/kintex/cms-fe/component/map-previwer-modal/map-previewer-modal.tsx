import { Modal } from 'antd';
import { MapViewer } from '../map-viewer/map-viewer';

const MapPreviewerModal = ({ mapId, open, onCancel }) => {
  return (
    <Modal
      title="미리보기"
      width={1200}
      open={open}
      cancelText="닫기"
      onCancel={onCancel}
      onOk={onCancel}
    >
      <MapViewer mapId={mapId} width={1100} markers={[]} onClick={null} />
    </Modal>
  );
};

export default MapPreviewerModal;
