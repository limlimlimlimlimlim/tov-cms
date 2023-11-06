import Modal from 'antd/es/modal/Modal';
import { useCallback, useEffect, useState } from 'react';
import {
  addSection,
  deleteSectionById,
  getSectionsByMapId,
} from '../../api/section';
import MapAreaEditor from './map-area-editor';
import { message } from 'antd';

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
  const [sections, setSections] = useState<any[]>([]);
  const [newSections, setNewSections] = useState<any[]>([]);
  const [delSections, setDelSections] = useState<any[]>([]);

  const getSections = useCallback(async () => {
    if (!map) return;
    const sec = await getSectionsByMapId(map.id);
    setSections(sec.data);
    setNewSections([]);
    setDelSections([]);
  }, [map]);

  const onAdd = useCallback(
    (s: any) => {
      setNewSections([...newSections, s]);
    },
    [newSections],
  );

  const onDelete = useCallback(
    (name) => {
      const addedIndex = newSections.findIndex((s) => s.name === name);
      if (addedIndex > -1) {
        const ns = [...newSections];
        ns.splice(addedIndex, 1);
        setNewSections(ns);
        return;
      }
      if (delSections.includes(name)) return;
      setDelSections([...delSections, name]);
    },
    [delSections, newSections],
  );

  const apply = useCallback(async () => {
    for (const ns of newSections) {
      await addSection(map.id, ns.path.join());
    }

    for (const ds of delSections) {
      await deleteSectionById(ds);
    }
    await getSections();
    void message.success('구역이 설정됐습니다.');
  }, [delSections, getSections, map, newSections]);

  useEffect(() => {
    void getSections();
  }, [getSections]);

  return (
    <Modal
      destroyOnClose
      width={1400}
      title="구역 설정"
      okText="저장"
      cancelText="취소"
      open={open}
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onOk={async () => {
        await apply();
        // onOk(sections);
      }}
      onCancel={onCancel}
    >
      <MapAreaEditor
        map={map}
        sections={sections}
        onAdd={onAdd}
        onDelete={onDelete}
      />
    </Modal>
  );
}
