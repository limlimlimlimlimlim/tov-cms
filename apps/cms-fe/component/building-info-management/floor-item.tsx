import { Button, Flex, Input, Modal, message } from 'antd';
import { useCallback, useState } from 'react';
import {
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { deleteFloor, updateFloor } from '../../api/building-info';

const { confirm } = Modal;

interface ComponentProps {
  data: any;
  onChange: () => void;
  onAdd: (order) => void;
}

export default function FloorItem({ data, onAdd, onChange }: ComponentProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [itemName, setItemName] = useState(data.name);

  const onClickAdd = useCallback(() => {
    onAdd(data.order + 1);
  }, [data, onAdd]);
  const onClickDelete = useCallback(() => {
    confirm({
      title: '층 삭제',
      okText: '확인',
      cancelText: '취소',
      content: '층을 삭제하시겠습니까?',
      async onOk() {
        try {
          await deleteFloor(data.id);
          onChange();
          void message.success('층이 삭제됐습니다.');
        } catch (e) {
          void message.error('층을 삭제할 수 없습니다.');
        }
      },
    });
  }, [data, onChange]);

  const onClickUpdate = useCallback(async () => {
    await updateFloor(data.id, { name: itemName });
    void message.success('층이 수정 됐습니다.');
    setIsEdit(false);
  }, [data, itemName]);

  const onClickEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

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
            <Button onClick={onClickAdd}>
              <PlusOutlined />
            </Button>
            <Button onClick={onClickDelete}>
              <MinusOutlined />
            </Button>
          </>
        )}

        {isEdit ? (
          <Flex gap="small">
            <Button onClick={onClickUpdate}>
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
        ) : (
          <Button onClick={onClickEdit}>
            <EditOutlined />
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
