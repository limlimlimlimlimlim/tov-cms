'use client';

import { Result } from 'antd';

const ErrorPage403 = () => {
  return <Result status="403" title="403" subTitle="접근 권한이 없습니다." />;
};

export default ErrorPage403;
