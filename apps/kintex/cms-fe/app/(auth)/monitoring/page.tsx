'use client';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';

const { Text } = Typography;

export default function Monitoring() {
  const [dataSource, setDataSource] = useState<any[]>([]);

  const columns = useMemo(() => {
    return [
      {
        title: '번호',
        width: 80,
        render: (_, __, index) => {
          return dataSource.length - index;
        },
      },
      {
        title: '키오스크 명',
        width: 150,
        dataIndex: 'name',
      },
      {
        title: '네트워크',
        width: 150,
        dataIndex: 'network',
        render: (value) => {
          return value ? <Text>ON</Text> : <Text type="danger">OFF</Text>;
        },
      },
      {
        title: '확인시간',
        width: 150,
        dataIndex: 'checkTime',
        render: (date: string) => format(new Date(date), 'yyyy-MM-dd hh:mm:ss'),
      },
      {
        title: '현재화면 스크린샷',
        width: 150,
        render: () => {
          return <Button size="small">스크린샷</Button>;
        },
      },
    ];
  }, [dataSource.length]);

  useEffect(() => {
    setDataSource([
      { name: 'test03', network: true, checkTime: Date.now() },
      { name: 'test02', network: true, checkTime: Date.now() },
      { name: 'test01', network: false, checkTime: Date.now() },
    ]);
  }, []);
  return (
    <div>
      <Flex vertical gap="middle">
        <Flex justify="space-between">
          <div>
            <ExclamationCircleOutlined style={{ marginRight: 5 }} />
            <Text>
              네트워크 상태 및 스크린샷은 확인 시간 기준으로 표시되며 상태
              갱신은 새로고침 버튼을 눌러주세요.
            </Text>
          </div>
          <Button type="primary">새로고침</Button>
        </Flex>
        <Table columns={columns} dataSource={dataSource} />
      </Flex>
    </div>
  );
}
