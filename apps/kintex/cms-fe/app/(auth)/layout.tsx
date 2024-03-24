'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import AppContainer from '../../component/app-container/app-container';
import { setBaseUrl } from '../../util/axios-client';

const AuthLayout = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setBaseUrl(`${window.location.protocol}//${window.location.hostname}:4001`);
  }, []);

  // const verifyAccessToken = useCallback(async () => {
  //   const token = localStorage.getItem('cms-access-token');
  //   if (token) {
  //     try {
  //       await verifyToken(token);
  //     } catch (e) {
  //       router.replace('/login');
  //     }
  //   } else {
  //     router.replace('/login');
  //   }
  // }, [router]);

  const verifyAccessTime = useCallback(() => {
    const timeQuery = searchParams.get('time');
    if (timeQuery) {
      const time = parseInt(atob(timeQuery));
      const now = Date.now();
      if (isNaN(time) || (now - time) / 1000 / 60 > 2) {
        router.replace('/error/403');
      }
    } else {
      router.replace('/error/403');
    }
  }, [router, searchParams]);

  useEffect(() => {
    if ((process as any).env.NODE_ENV !== 'development') {
      verifyAccessTime();
    }
  }, [verifyAccessTime]);

  return <AppContainer>{children}</AppContainer>;
};

export default AuthLayout;
