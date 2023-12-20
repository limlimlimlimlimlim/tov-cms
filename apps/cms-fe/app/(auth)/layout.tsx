'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import AppContainer from '../../component/app-container/app-container';
import { verifyToken } from '../../api/auth';
import { setBaseUrl } from '../../util/axios-client';

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    setBaseUrl(`${window.location.protocol}//${window.location.hostname}:3001`);
  }, []);

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
