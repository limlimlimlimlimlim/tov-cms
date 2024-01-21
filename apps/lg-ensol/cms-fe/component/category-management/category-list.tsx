import { Button, Flex, Form, Input, Modal } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createCategory, getCategoryTree } from '../../api/category';
import CategoryItem from './category-item';

const { confirm } = Modal;

export default function CategoryList() {
  const [categoryData, setCategoryData] = useState([]);
  const newItemNameKr = useRef('');

  const fetchData = useCallback(async () => {
    const result = await getCategoryTree();

    setCategoryData(result.data);
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onAddItem = useCallback(() => {
    confirm({
      title: '카테고리 추가',
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
        await createCategory({ name: newItemNameKr.current });
        await fetchData();
      },
    });
  }, [fetchData, newItemNameKr]);

  const createItems = useCallback(() => {
    return categoryData.map((item: any) => {
      return (
        <CategoryItem
          key={item.id}
          id={item.id}
          name={item.name}
          subCategories={item.subCategories}
          onChange={() => {
            void fetchData();
          }}
        />
      );
    }, []);
  }, [categoryData, fetchData]);
  return (
    <Flex vertical gap="small" style={{ width: '100%' }}>
      <Button onClick={onAddItem} style={{ width: 130 }}>
        카테고리 추가
      </Button>
      {createItems()}
    </Flex>
  );
}
