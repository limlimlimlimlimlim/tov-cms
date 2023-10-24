import { Flex, Input, Modal, message } from 'antd';
import { useCallback, useState } from 'react';
import BuildingItem from './building-item';

const { confirm } = Modal;

interface ComponentProps {
  data: any[];
  onDelete: (id) => void;
}

export default function BuildingList({ data, onDelete }: ComponentProps) {
  const [newItemName, setNewItemName] = useState('');
  const onAdd = useCallback(() => {
    confirm({
      title: '건물(동) 추가',
      okText: '확인',
      cancelText: '취소',
      content: (
        <Flex vertical>
          <span>카테고리 이름을 입력해주세요.</span>
          <Input
            onChange={(e) => {
              setNewItemName(e.target.value);
            }}
          />
        </Flex>
      ),
      onOk() {
        void message.success('건물(동)이 생성됐습니다.');
      },
    });
    confirm;
  }, [newItemName]);

  const onChange = useCallback(() => {}, []);

  const createItems = useCallback(() => {
    return data.map((item) => {
      return (
        <BuildingItem
          key={item.id}
          id={item.id}
          name={item.name}
          child={item.child}
          onAdd={onAdd}
          onDelete={onDelete}
          onUpdate={onChange}
        />
      );
    }, []);
  }, [data, onAdd, onChange]);
  return (
    <Flex vertical gap="small" style={{ width: '100%' }}>
      {createItems()}
    </Flex>
  );
}
