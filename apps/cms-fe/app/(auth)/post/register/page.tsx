'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import usePermission from '../../hooks/use-permission';
import PostForm from '../post-form';

export default function PostRegister() {
  const { ready, getPostPermissions }: any = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const result = getPostPermissions();
    if (!result.write) {
      router.replace('/error/403');
    }
  }, [getPostPermissions, ready, router]);

  return <PostForm data={null} />;
}
