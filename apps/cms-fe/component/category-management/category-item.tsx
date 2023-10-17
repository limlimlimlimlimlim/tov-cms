import { Button, Flex, Input } from "antd";
import { useCallback, useState } from "react";
import CategoryList from "./category-list";
import {
  CloseOutlined,
  EditOutlined,
  MinusOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";

interface ComponentProps {
  id: string;
  name: string;
  child: any[];
  onAdd: (id) => void;
  onRemove: (id) => void;
  onChange: (id, value) => void;
}

export default function CategoryItem({
  id,
  name,
  child,
  onAdd,
  onRemove,
  onChange,
}: ComponentProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [categoryName, setCategoryName] = useState(name);

  const onClickAdd = useCallback(() => {
    onAdd(id);
  }, [id, onAdd]);

  const onClickRemove = useCallback(() => {
    onRemove(id);
  }, [id, onRemove]);

  const onClickUpdate = useCallback(() => {
    onChange(id, categoryName);
    setIsEdit(false);
  }, [categoryName, id, onChange]);

  const onClickEdit = useCallback(() => {
    setIsEdit(true);
  }, []);

  return (
    <Flex vertical gap="small">
      <Flex gap="small">
        <Input
          readOnly={!isEdit}
          onChange={(value: any) => {
            setCategoryName(value.target.value as string);
          }}
          value={categoryName}
        />

        {!isEdit && (
          <>
            <Button onClick={onClickAdd}>
              <PlusOutlined />
            </Button>
            <Button onClick={onClickRemove}>
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
                setCategoryName(name);
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
          <CategoryList categories={child} />
        </Flex>
      )}
    </Flex>
  );
}
