import { Modal } from "antd";
import { useState } from "react";
import CategoryList from "./category-list";

interface ComponentProps {
  open: boolean;
  onCancel: () => void;
}

export default function CategoryManagementManagementModal({
  open,
  onCancel,
}: ComponentProps) {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "시설",
      child: [
        { id: 10, name: "식당" },
        { id: 11, name: "복지시설" },
      ],
    },
    {
      id: 2,
      name: "부대시설",
      child: [
        { id: 21, name: "화장실" },
        { id: 22, name: "계단" },
        { id: 23, name: "엘리베이터" },
        { id: 24, name: "키오스크" },
      ],
    },
  ]);

  return (
    <Modal
      title="카테고리 관리"
      open={open}
      cancelText="닫기"
      onCancel={() => {
        onCancel();
      }}
    >
      <CategoryList categories={categories} />
    </Modal>
  );
}
