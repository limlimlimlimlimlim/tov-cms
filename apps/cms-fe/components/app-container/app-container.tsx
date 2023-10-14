"use client";

import { Layout, theme } from "antd";
import { useCallback, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import AppSider from "../app-sider/app-sider";
import AppHeader from "../app-hader/app-header";

const { Content } = Layout;

export default function AppContainer({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onChangeCollapse = useCallback((value: boolean) => {
    setCollapsed(value);
  }, []);

  return (
    <Layout style={{ height: "100%" }}>
      <AppSider collapsed={collapsed} />
      <Layout>
        <AppHeader onChangeCollapse={onChangeCollapse} collapsed={collapsed} />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
