'use client';

import { Layout, Button, theme, Flex } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Header } = Layout;

export default function AppHeader({ collapsed, onChangeCollapse }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // const [userName, setUserName] = useState<string | null>('');
  // const router = useRouter();

  // useEffect(() => {
  //   setUserName(localStorage.getItem('cms-user-name') as string | null);
  // }, []);

  return (
    <Header style={{ padding: 0, background: colorBgContainer }}>
      <Flex justify="space-between" style={{ paddingRight: 30 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => {
            onChangeCollapse(!collapsed);
          }}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
        {/* <Flex gap="small" align="middle">
          <span>{userName}님 안녕하세요.</span>
          <span>
            <Button
              size="small"
              onClick={() => {
                localStorage.removeItem('cms-user-name');
                localStorage.removeItem('cms-user-permission-id');
                localStorage.removeItem('cms-access-token');
                router.replace('/login');
              }}
            >
              로그아웃
            </Button>
          </span>
        </Flex> */}
      </Flex>
    </Header>
  );
}
