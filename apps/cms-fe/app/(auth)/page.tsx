'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import AppContainer from '../../component/app-container/app-container';
import { verifyToken } from '../../api/auth';

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const verifyAccessToken = useCallback(async () => {
    const token = localStorage.getItem('cms-access-token');
    if (token) {
      try {
        const result = await verifyToken(token);
        if (result.data) {
          router.replace('/home');
        }
      } catch (e) {
        //
      }
    } else {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    void verifyAccessToken();
  }, [verifyAccessToken]);

  console.log('??');
  return <AppContainer>{children}</AppContainer>;
};

export default AuthLayout;
