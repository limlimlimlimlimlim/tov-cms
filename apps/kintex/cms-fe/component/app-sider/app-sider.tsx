import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import {
  CalendarOutlined,
  DesktopOutlined,
  EnvironmentOutlined,
  FormOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './styles.module.css';
import useLink from '../../app/(auth)/hooks/use-link';
import { useMemo } from 'react';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export default function AppSider({ collapsed }) {
  const pathname = usePathname();
  const { replace } = useLink();

  const items: MenuItem[] = useMemo(() => {
    return [
      // getItem('계정 관리', 'account-management', <IdcardOutlined />, [
      //   getItem(<Link href="/account">계정 관리</Link>, 'account'),
      //   getItem(<Link href="/permission">권한 관리</Link>, 'permission'),
      // ]),
      getItem(
        <Link
          href=""
          onClick={(e) => {
            e.preventDefault();
            replace('/schedule/list');
          }}
        >
          스케줄
        </Link>,
        'schedule',
        <CalendarOutlined />,
      ),
      getItem(
        <Link
          href=""
          onClick={(e) => {
            e.preventDefault();
            replace('/post/list');
          }}
        >
          게시물
        </Link>,
        'post',
        <FormOutlined />,
      ),
      getItem('지도 관리', 'map-management', <EnvironmentOutlined />, [
        getItem(
          <Link
            href=""
            onClick={(e) => {
              e.preventDefault();
              replace('/map/list');
            }}
          >
            층별 지도
          </Link>,
          'map',
        ),
        getItem(
          <Link
            href=""
            onClick={(e) => {
              e.preventDefault();
              replace('/map-info/list');
            }}
          >
            지도 정보
          </Link>,
          'map-info',
        ),
      ]),
      getItem(
        <Link
          href=""
          onClick={(e) => {
            e.preventDefault();
            replace('/facility/list');
          }}
        >
          시설 관리
        </Link>,
        'facility',
        <ShopOutlined />,
      ),
      getItem(
        <Link
          href=""
          onClick={(e) => {
            e.preventDefault();
            replace('/monitoring');
          }}
        >
          모니터링
        </Link>,
        'monitoring',
        <DesktopOutlined />,
      ),
      // getItem(
      //   <Link href="/kiosk">키오스크 관리</Link>,
      //   'kiosk',
      //   <DesktopOutlined />,
      // ),
    ];
  }, []);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className={styles.logo} />
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        defaultSelectedKeys={[pathname.split('/')[1]]}
        defaultOpenKeys={[/*'account-management',*/ 'map-management']}
        onSelect={(e) => {
          localStorage.removeItem(`cms_${e.key}_search_keyword`);
        }}
      />
    </Sider>
  );
}
