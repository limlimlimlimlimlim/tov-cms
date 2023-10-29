import { Flex, Form, Input, Modal, message } from 'antd';
import { useCallback, useState } from 'react';
import FloorItem from './floor-item';

const { confirm } = Modal;

interface ComponentProps {
  data: any[];
  onDeleteFloor: (id) => void;
  onDeleteBuilding: (id) => void;
  onUpdate: () => void;
}

export default function FloorList({
  data,
  onUpdate,
  onDeleteFloor,
  onDeleteBuilding,
}: ComponentProps) {
  const [newItemNameKr, setNewItemNameKr] = useState('');
  const [newItemNameEn, setNewItemNameEn] = useState('');
  const onAddItem = useCallback(() => {
    confirm({
      title: '층 추가',
      okText: '확인',
      cancelText: '취소',
      content: (
        <Flex vertical gap="large">
          <span>층을 입력해주세요.</span>
          <Form.Item label="한글" style={{ marginBottom: 0 }}>
            <Input
              onChange={(e) => {
                setNewItemNameKr(e.target.value);
                onUpdate();
              }}
            />
          </Form.Item>
          <Form.Item label="영어">
            <Input
              onChange={(e) => {
                setNewItemNameEn(e.target.value);
                onUpdate();
              }}
            />
          </Form.Item>
        </Flex>
      ),
      onOk() {
        onUpdate();
      },
    });
    confirm;
  }, [newItemNameKr, newItemNameEn]);

  const onUpdateItem = useCallback(() => {
    onUpdate();
  }, []);

  const createItems = useCallback(() => {
    return data.map((item) => {
      return (
        <FloorItem
          key={item.id}
          id={item.id}
          name={item.name}
          child={item.child}
          onAdd={onAddItem}
          onDelete={onDeleteFloor}
          onUpdate={onUpdateItem}
          onDeleteBuilding={onDeleteBuilding}
        />
      );
    }, []);
  }, [data, onAddItem, onUpdateItem, onDeleteFloor]);
  return (
    <Flex vertical gap="small" style={{ width: '100%' }}>
      {createItems()}
    </Flex>
  );
}