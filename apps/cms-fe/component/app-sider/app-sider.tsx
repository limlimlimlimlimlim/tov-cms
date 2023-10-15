import { Layout, Menu, MenuProps } from "antd";
import {
  CalendarOutlined,
  DesktopOutlined,
  EnvironmentOutlined,
  FormOutlined,
  IdcardOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import Link from "next/link";

import styles from "./styles.module.css";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("계정 관리", "account", <IdcardOutlined />, [
    getItem(<Link href="/account/list">계정 관리</Link>, "/account/list"),
    getItem(<Link href="/permission/list">권한 관리</Link>, "/permission/list"),
  ]),
  getItem(
    <Link href="/schedule/list">스케줄</Link>,
    "schedule",
    <CalendarOutlined />
  ),
  getItem(<Link href="/post/list">게시물</Link>, "posts", <FormOutlined />),
  getItem("지도 관리", "map", <EnvironmentOutlined />, [
    getItem(<Link href="/map/floor/list">층별 지도</Link>, "/map/floor/list"),
    getItem(<Link href="/map/info/list">지도 정보</Link>, "/map/info/list"),
  ]),
  getItem(
    <Link href="/facility/list">시설 관리</Link>,
    "facility",
    <ShopOutlined />
  ),
  getItem(
    <Link href="/kiosk/list">키오스크 관리</Link>,
    "kiosk",
    <DesktopOutlined />
  ),
];

export default function AppSider({ collapsed }) {
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className={styles.logo} />
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        defaultSelectedKeys={["/account/list"]}
        defaultOpenKeys={["account", "map"]}
      />
    </Sider>
  );
}
