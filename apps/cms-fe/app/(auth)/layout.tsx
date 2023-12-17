'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import AppContainer from '../../component/app-container/app-container';
import { verifyToken } from '../../api/auth';

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const pathName = usePathname();

  const verifyAccessToken = useCallback(async () => {
    const token = localStorage.getItem('cms-access-token');
    if (token) {
      try {
        await verifyToken(token);
      } catch (e) {
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [router]);

  useEffect(() => {
    void verifyAccessToken();
  }, [pathName, verifyAccessToken]);

  return <AppContainer>{children}</AppContainer>;
};

export default AuthLayout;
