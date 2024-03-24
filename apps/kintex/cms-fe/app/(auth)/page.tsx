'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return <>loading</>;
};

export default AuthPage;
