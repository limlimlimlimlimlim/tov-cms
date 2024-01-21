'use client';

import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

const ErrorPage403 = () => {
  const router = useRouter();
  return (
    <Result
      status="403"
      title="403"
      subTitle="접근 권한이 없습니다."
      extra={
        <Button
          type="primary"
          onClick={() => {
            router.replace('/home');
          }}
        >
          홈으로 가기
        </Button>
      }
    />
  );
};

export default ErrorPage403;
