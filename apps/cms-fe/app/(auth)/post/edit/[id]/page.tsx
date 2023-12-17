'use client';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import PostForm from '../../post-form';
import { getPostDetail } from '../../../../../api/post';
import usePermission from '../../../hooks/use-permission';

export default function PostEdit() {
  const { id } = useParams();
  const [postData, setPostData] = useState();
  const { ready, getPostPermissions }: any = usePermission();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const data = await getPostDetail(id);
    setPostData(data.data);
  }, [id]);

  useEffect(() => {
    if (!ready) return;
    const result = getPostPermissions();
    if (!result.update) {
      router.replace('/error/403');
    }
    void fetchData();
  }, [fetchData, getPostPermissions, ready, router]);

  return <PostForm data={postData} />;
}
