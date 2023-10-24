import { Modal, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import {
  deleteBuilding,
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    const result = await getBuildingInfoTree();
    setData(result.data);
  }, []);

  const onUpdate = useCallback(() => {
    fetchData();
  }, []);

  const onDeleteBuilding = useCallback((id) => {
    confirm({
      title: '건물(동) 삭제',
      okText: '확인',
      cancelText: '취소',
      content: '건물(동) 삭제하시겠습니까?',
      async onOk() {
        try {
          await deleteBuilding(id);
          fetchData();
          void message.success('건물(동)이 삭제됐습니다.');
        } catch (e) {
          void message.error('건물(동)을 삭제할 수 없습니다.');
        }
      },
    });
  }, []);

  const onDeleteFloor = useCallback((id) => {
    confirm({
      title: '층 삭제',
      okText: '확인',
      cancelText: '취소',
      content: '층을 삭제하시겠습니까?',
      async onOk() {
        try {
          await deleteFloor(id);
          fetchData();
          void message.success('층이 삭제됐습니다.');
        } catch (e) {
          void message.error('층을 삭제할 수 없습니다.');
        }
      },
    });
  }, []);

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
        onDeleteBuilding={onDeleteBuilding}
        onDeleteFloor={onDeleteFloor}
      />
    </Modal>
  );
}
