import { Flex, Input, Modal, message } from 'antd';
import { useCallback, useState } from 'react';
// eslint-disable-next-line import/no-cycle
import CategoryItem from './category-item';

const { confirm } = Modal;

interface ComponentProps {
  categories: any[];
}

export default function CategoryList({ categories }: ComponentProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const onAdd = useCallback(() => {
    confirm({
      title: '카테고리 추가',
      okText: '확인',
      cancelText: '취소',
      content: (
        <Flex vertical>
          <span>카테고리 이름을 입력해주세요.</span>
          <Input
            onChange={(e) => {
              setNewCategoryName(e.target.value);
            }}
          />
        </Flex>
      ),
      onOk() {
        void message.success('카테고리가 생성됐습니다.');
      },
    });
    confirm;
  }, [newCategoryName]);

  const onRemove = useCallback(() => {
    confirm({
      title: '카테고리 삭제',
      okText: '확인',
      cancelText: '취소',
      content: '카테고리를 삭제하시겠습니까?',
      onOk() {
        void message.success('카테고리가 삭제됐습니다.');
      },
    });
  }, []);
  const onChange = useCallback(() => {}, []);

  const createItems = useCallback(() => {
    return categories.map((category) => {
      return (
        <CategoryItem
          key={category.id}
          id={category.id}
          name={category.name}
          child={category.child}
          onAdd={onAdd}
          onRemove={onRemove}
          onChange={onChange}
        />
      );
    }, []);
  }, [categories, onAdd, onChange, onRemove]);
  return (
    <Flex vertical gap="small" style={{ width: '100%' }}>
      {createItems()}
    </Flex>
  );
}
