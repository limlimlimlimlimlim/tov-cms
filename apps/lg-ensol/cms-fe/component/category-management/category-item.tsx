import { Button, Flex, Form, Input, Modal, message } from 'antd';
import { useCallback, useRef, useState } from 'react';
import {
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import {
  createSubCategory,
  deleteCategory,
  updateCategory,
} from '../../api/category';
import SubCategoryList from './sub-category-list';

const { confirm } = Modal;

interface ComponentProps {
  id: string;
  name: string;
  subCategories: any[];
  onChange: () => void;
}

export default function CategoryItem({
  id,
  name,
  subCategories,
  onChange,
}: ComponentProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [itemName, setItemName] = useState(name);
  const newItemNameKr = useRef('');
  const onClickEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  const onAddItem = () => {
    confirm({
      title: '상세 추가',
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
        await createSubCategory({
          categoryId: id,
          name: newItemNameKr.current,
        });
        onChange();
        newItemNameKr.current = '';
      },
    });
  };

  const onDeleteCategory = useCallback(() => {
    confirm({
      title: '카테고리 삭제',
      okText: '확인',
      cancelText: '취소',
      content:
        '카테고리를 삭제하시겠습니까? 카테고리에 등록된 서브카테고리도 함께 삭제 됩니다.',
      async onOk() {
        try {
          await deleteCategory(id);
          onChange();
          void message.success('카테고리가 삭제됐습니다.');
        } catch (e) {
          void message.error('카테고리를 삭제할 수 없습니다.');
        }
      },
    });
  }, [id, onChange]);

  const onUpdateCategory = useCallback(() => {
    confirm({
      title: '카테고리 수정',
      okText: '확인',
      cancelText: '취소',
      content: '카테고리를 수정하시겠습니까?',
      async onOk() {
        try {
          await updateCategory(id, { name: itemName });
          setIsEdit(false);
          onChange();
          void message.success('카테고리가 수정됐습니다.');
        } catch (e) {
          void message.error('카테고리를 수정할 수 없습니다.');
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
              상세추가
            </Button>
            <Button onClick={onClickEdit}>
              <EditOutlined />
            </Button>
            <Button onClick={onDeleteCategory}>
              <MinusOutlined />
            </Button>
          </>
        )}

        {isEdit ? (
          <Flex gap="small">
            <Button onClick={onUpdateCategory}>
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
      {Boolean(subCategories) && subCategories.length > 0 && (
        <Flex style={{ paddingLeft: 30 }}>
          <SubCategoryList
            data={subCategories}
            onChange={onChange}
            onAddItem={onAddItem}
          />
        </Flex>
      )}
    </Flex>
  );
}
