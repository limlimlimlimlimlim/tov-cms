import { Divider, Modal } from 'antd';
import { useRef } from 'react';
import KioskPositionManagement from './kiosk-position-management';

interface ComponentProps {
  mapId: string;
  open: boolean;
  kiosk: any;
  mapSections: any[];
  onCancel: () => void;
  onOk: (data) => void;
}

export default function KioskPositionManagementModal({
  mapId,
  open,
  kiosk,
  mapSections,
  onCancel,
  onOk,
}: ComponentProps) {
  const kioskData = useRef<any>();
  return (
    <Modal
      destroyOnClose
      title="위치 설정"
      width={1200}
      okText="적용"
      cancelText="취소"
      open={open}
      onOk={() => {
        onOk(kioskData.current);
      }}
      onCancel={() => {
        onCancel();
      }}
    >
      <Divider />
      <KioskPositionManagement
        mapId={mapId}
        kiosk={kiosk}
        mapSections={mapSections}
        onChange={(data) => {
          kioskData.current = data;
        }}
      />
    </Modal>
  );
}
