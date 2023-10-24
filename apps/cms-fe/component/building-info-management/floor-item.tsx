import { Button, Flex, Input } from 'antd';
import { useCallback, useState } from 'react';
import {
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import BuildingList from './building-list';

interface ComponentProps {
  id: string;
  name: string;
  child: any[];
  onAdd: (id) => void;
  onDelete: (id) => void;
  onDeleteBuilding: (id) => void;
  onUpdate: (id, value) => void;
}

export default function FloorItem({
  id,
  name,
  child,
  onAdd,
  onDelete,
  onDeleteBuilding,
  onUpdate,
}: ComponentProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [itemName, setItemName] = useState(name);

  const onClickAdd = useCallback(() => {
    onAdd(id);
  }, [id, onAdd]);

  const onClickDelete = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  const onClickUpdate = useCallback(() => {
    onUpdate(id, itemName);
    setIsEdit(false);
  }, [itemName, id, onUpdate]);

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
      {Boolean(child) && child.length > 0 && (
        <Flex style={{ paddingLeft: 30 }}>
          <BuildingList data={child} onDelete={onDeleteBuilding} />
        </Flex>
      )}
    </Flex>
  );
}
