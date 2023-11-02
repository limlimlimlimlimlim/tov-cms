import { Modal, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import {
  deleteWing,
  deleteFloor,
  getBuildingInfoTree,
} from '../../api/building-info';
import FloorList from './floor-list';

interface ComponentProps {
  open: boolean;
  onCancel: () => void;
}

const { confirm } = Modal;

export default function BuldingInfoManagementModal({
  open,
  onCancel,
}: ComponentProps) {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    const result = await getBuildingInfoTree();
    setData(result.data);
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onUpdate = useCallback(() => {
    void fetchData();
  }, [fetchData]);

  const onDeleteWing = useCallback(
    (id) => {
      confirm({
        title: '건물(동) 삭제',
        okText: '확인',
        cancelText: '취소',
        content: '건물(동) 삭제하시겠습니까?',
        async onOk() {
          try {
            await deleteWing(id);
            await fetchData();
            void message.success('건물(동)이 삭제됐습니다.');
          } catch (e) {
            void message.error('건물(동)을 삭제할 수 없습니다.');
          }
        },
      });
    },
    [fetchData],
  );

  const onDeleteFloor = useCallback(
    (id) => {
      confirm({
        title: '층 삭제',
        okText: '확인',
        cancelText: '취소',
        content: '층을 삭제하시겠습니까?',
        async onOk() {
          try {
            await deleteFloor(id);
            await fetchData();
            void message.success('층이 삭제됐습니다.');
          } catch (e) {
            void message.error('층을 삭제할 수 없습니다.');
          }
        },
      });
    },
    [fetchData],
  );

  return (
    <Modal
      title="건물 정보 관리"
      open={open}
      cancelText="닫기"
      onCancel={onCancel}
    >
      <FloorList
        data={data}
        onUpdate={onUpdate}
        onDeleteWing={onDeleteWing}
        onDeleteFloor={onDeleteFloor}
      />
    </Modal>
  );
}
