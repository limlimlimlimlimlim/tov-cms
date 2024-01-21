'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { verifyToken } from '../../api/auth';

const AuthLayout = () => {
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
    // void verifyAccessToken();
    router.replace('/home');
  }, [verifyAccessToken]);

  return <>loading</>;
};

export default AuthLayout;
