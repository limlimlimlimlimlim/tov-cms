'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const useLink = () => {
  const router = useRouter();

  const replace = useCallback(
    (path: string) => {
      const time = btoa(Date.now().toString());
      router.replace(`${path}?time=${time}`);
    },
    [router],
  );

  return {
    replace,
  };
};

export default useLink;
