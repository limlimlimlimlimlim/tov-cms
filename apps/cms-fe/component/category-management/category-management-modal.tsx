import { Modal } from 'antd';
import CategoryList from './category-list';

interface ComponentProps {
  open: boolean;
  onCancel: () => void;
}

export default function CatrgoryManagementModal({
  open,
  onCancel,
}: ComponentProps) {
  return (
    <Modal
      title="카테고리 관리!!"
      open={open}
      cancelText="닫기"
      onCancel={onCancel}
      onOk={onCancel}
    >
      <CategoryList />
    </Modal>
  );
}
