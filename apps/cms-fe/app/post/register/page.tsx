'use client';
import { Tabs } from 'antd';
import PostForm from '../post-form';

export default function PostRegister() {
  return (
    <Tabs
      type="card"
      items={[
        {
          key: 'ko',
          label: '한글',
          children: <PostForm data={null} />,
        },
        {
          key: 'en',
          label: '영어',
          children: <PostForm data={null} />,
        },
      ]}
    />
  );
}
