'use client';

import { Button, Card, Flex, Form, Input, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, verifyToken } from '../../api/auth';
import { setToken } from '../../util/axios-client';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [verified, setVerified] = useState(false);
  const router = useRouter();

  const onClickLogin = useCallback(async () => {
    try {
      const user: any = await login({ userId, password: userPassword });
      if (user.data.message === 'success') {
        localStorage.setItem('cms-user-name', user.data.name);
        localStorage.setItem('cms-user-permission-id', user.data.permissionId);
        localStorage.setItem('cms-access-token', user.data.token);
        setToken(user.data.token);
        router.replace('/home');
        setVerified(true);
      }
    } catch (e) {
      void message.error('아이디 또는 비밀번호를 확인해주세요.');
    }
  }, [router, userId, userPassword]);

  const verifyAccessToken = useCallback(async () => {
    const token = localStorage.getItem('cms-access-token');
    if (token) {
      try {
        const result = await verifyToken(token);
        if (result.data) {
          router.replace('/home');
        }
      } catch (e) {
        router.replace('/login');
      }
    }
  }, [router]);

  useEffect(() => {
    void verifyAccessToken();
  }, [verifyAccessToken]);

  return (
    <>
      {verified ? null : (
        <Flex justify="center" align="center" style={{ height: '100%' }}>
          <Card
            title="LG 에너지솔루션 건물안내 CMS"
            bordered={false}
            style={{ width: 400 }}
          >
            <Form>
              <Flex gap="middle">
                <Flex vertical gap="small" flex={1}>
                  <Input
                    placeholder="아이디"
                    value={userId}
                    onChange={({ target }) => {
                      setUserId(target.value);
                    }}
                  />
                  <Input
                    placeholder="비밀번호"
                    type="password"
                    onChange={({ target }) => {
                      setUserPassword(target.value);
                    }}
                  />
                </Flex>
                <Flex>
                  <Button
                    type="primary"
                    style={{ width: '100%', height: '100%' }}
                    onClick={onClickLogin}
                  >
                    로그인
                  </Button>
                </Flex>
              </Flex>
            </Form>
          </Card>
        </Flex>
      )}
    </>
  );
};

export default Login;
