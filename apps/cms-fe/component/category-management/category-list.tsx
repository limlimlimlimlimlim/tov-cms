import { Flex } from "antd";
import { useCallback } from "react";
import CategoryItem from "./category-item";

interface ComponentProps {
  categories: any[];
}

export default function CategoryList({ categories }: ComponentProps) {
  const onAdd = useCallback(() => {}, []);
  const onRemove = useCallback(() => {}, []);
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
    <Flex vertical gap="small" style={{ width: "100%" }}>
      {createItems()}
    </Flex>
  );
}
