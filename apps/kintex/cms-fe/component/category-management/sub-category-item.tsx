import { Button, Flex, Input, Modal, message } from 'antd';
import { useCallback, useState } from 'react';
import {
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { deleteSubCateogy, updateSubCateogy } from '../../api/category';

const { confirm } = Modal;

interface ComponentProps {
  data: any;
  onChange: () => void;
  onAdd: () => void;
}

export default function SubCategoryItem({
  data,
  onAdd,
  onChange,
}: ComponentProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [itemName, setItemName] = useState(data.name);

  const onClickAdd = useCallback(() => {
    onAdd();
  }, [onAdd]);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '서브카테고리 삭제',
      okText: '확인',
      cancelText: '취소',
      content: '서브카테고리를 삭제하시겠습니까?',
      async onOk() {
        try {
          await deleteSubCateogy(data.id);
          onChange();
          void message.success('서브카테고리가 삭제됐습니다.');
        } catch (e) {
          void message.error('서브카테고리를 삭제할 수 없습니다.');
        }
      },
    });
  }, [data, onChange]);

  const onClickUpdate = useCallback(async () => {
    await updateSubCateogy(data.id, { name: itemName });
    void message.success('서브카테고리가 수정 됐습니다.');
    setIsEdit(false);
  }, [data, itemName]);

  const onClickEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  return (
    <Flex vertical gap="small">
      <Flex>
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
