'use client';

import { useEffect } from 'react';
import useLink from './hooks/use-link';

const AuthPage = () => {
  const { replace } = useLink();

  useEffect(() => {
    replace('/home');
  }, [replace]);

  return <>loading</>;
};

export default AuthPage;
