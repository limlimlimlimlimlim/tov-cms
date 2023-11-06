import Modal from 'antd/es/modal/Modal';
import { useCallback, useState } from 'react';
import { addSection } from '../../api/section';
import MapAreaEditor from './map-area-editor';

interface ComponentProps {
  map: any;
  open: boolean;
  onOk: (data?: any) => void;
  onCancel: () => void;
}

export default function MapAreaEditorModal({
  map,
  open,
  onOk,
  onCancel,
}: ComponentProps) {
  const [sections, setSections] = useState<any>();
  const onChange = useCallback((value) => {
    setSections(value);
  }, []);

  return (
    <Modal
      width={1400}
      title="구역 설정"
      okText="저장"
      cancelText="취소"
      open={open}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onOk={async () => {
        if (!sections) return;
        for (const s of sections.new) {
          await addSection(map.id, s.join());
        }
        onOk(sections);
      }}
      onCancel={onCancel}
    >
      <MapAreaEditor map={map} onChange={onChange} />
    </Modal>
  );
}
