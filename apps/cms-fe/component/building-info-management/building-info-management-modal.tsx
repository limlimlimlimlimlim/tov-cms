import { Modal, Tabs } from "antd";
import { useCallback } from "react";

interface ComponentProps {
  open: boolean;
  onCancel: () => void;
}

const TabPane = Tabs.TabPane;

export default function BuldingInfoManagementModal({
  open,
  onCancel,
}: ComponentProps) {
  const updateBuildingInfoData = useCallback(() => {}, []);

  return (
    <Modal
      title="건물 정보 관리"
      open={open}
      okText="저장"
      cancelText="취소"
      onOk={updateBuildingInfoData}
      onCancel={() => {
        onCancel();
      }}
    >
      <Tabs type="card">
        <TabPane tab="한글" key="ko">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="영어" key="en">
          Content of Tab Pane 2
        </TabPane>
      </Tabs>
    </Modal>
  );
}
