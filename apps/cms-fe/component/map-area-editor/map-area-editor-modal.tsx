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
  // const deleteSections = useCallback(async (ss) => {
  //   await Promise.all(
  //     ss.map((s) => {
  //       return deleteSectionById(s.id);
  //     }),
  //   );
  //   void message.success('구역이 삭제됐습니다.');
  // }, []);

  // const onDelete = useCallback(
  //   async (name) => {
  //     const addedIndex = newSections.findIndex((s) => s.name === name);
  //     if (addedIndex > -1) {
  //       const ns = [...newSections];
  //       ns.splice(addedIndex, 1);
  //       setNewSections(ns);
  //       return;
  //     }
  //     if (delSections.includes(name)) return;
  //     setDelSections([...delSections, name]);
  //     await deleteSections(delSections);
  //   },
  //   [delSections, deleteSections, newSections],
  // );

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
