import { Button, Flex, Form, Input, Modal, message } from 'antd';
import { useCallback, useRef, useState } from 'react';
import {
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { createFloor, deleteWing, updateWing } from '../../api/building-info';
import FloorList from './floor-list';

const { confirm } = Modal;

interface ComponentProps {
  id: string;
  name: string;
  floors: any[];
  onChange: () => void;
}

export default function WingItem({
  id,
  name,
  floors,
  onChange,
}: ComponentProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [itemName, setItemName] = useState(name);
  const newItemNameKr = useRef('');
  const onClickEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  const onAddItem = (order?) => {
    confirm({
      title: '층 추가',
      okText: '확인',
      cancelText: '취소',
      content: (
        <Flex vertical gap="large">
          <span>정보를 입력해주세요.</span>
          <Form.Item label="이름" style={{ marginBottom: 0 }}>
            <Input
              onChange={(e) => {
                newItemNameKr.current = e.target.value;
              }}
            />
          </Form.Item>
        </Flex>
      ),
      async onOk() {
        await createFloor({
          wingId: id,
          name: newItemNameKr.current,
          order,
        });
        onChange();
        newItemNameKr.current = '';
      },
    });
  };

  const onDeleteWing = useCallback(() => {
    confirm({
      title: '건물(동) 삭제',
      okText: '확인',
      cancelText: '취소',
      content:
        '건물(동) 삭제하시겠습니까? 건물에 등록된 층 정보도 함께 삭제 됩니다.',
      async onOk() {
        try {
          await deleteWing(id);
          onChange();
          void message.success('건물(동)이 삭제됐습니다.');
        } catch (e) {
          void message.error('건물(동)을 삭제할 수 없습니다.');
        }
      },
    });
  }, [id, onChange]);

  const onUpdateWing = useCallback(() => {
    confirm({
      title: '건물(동) 수정',
      okText: '확인',
      cancelText: '취소',
      content: '건물(동)을 수정하시겠습니까?',
      async onOk() {
        try {
          await updateWing(id, { name: itemName });
          setIsEdit(false);
          onChange();
          void message.success('건물(동)이 수정됐습니다.');
        } catch (e) {
          void message.error('건물(동)을 수정할 수 없습니다.');
        }
      },
    });
  }, [id, itemName, onChange]);

  return (
    <Flex vertical gap="small">
      <Flex gap="small">
        <Input
          readOnly={!isEdit}
          onChange={(value: any) => {
            setItemName(value.target.value as string);
          }}
          value={itemName}
        />

        {!isEdit && (
          <>
            <Button
              onClick={() => {
                onAddItem();
              }}
            >
              층 추가
            </Button>
            <Button onClick={onClickEdit}>
              <EditOutlined />
            </Button>
            <Button onClick={onDeleteWing}>
              <MinusOutlined />
            </Button>
          </>
        )}

        {isEdit ? (
          <Flex gap="small">
            <Button onClick={onUpdateWing}>
              <SaveOutlined />
            </Button>
            <Button
              onClick={() => {
                setItemName(name);
                setIsEdit(false);
              }}
            >
              <CloseOutlined />
            </Button>
          </Flex>
        ) : null}
      </Flex>
      {Boolean(floors) && floors.length > 0 && (
        <Flex style={{ paddingLeft: 30 }}>
          <FloorList data={floors} onChange={onChange} onAddFloor={onAddItem} />
        </Flex>
      )}
    </Flex>
  );
}
