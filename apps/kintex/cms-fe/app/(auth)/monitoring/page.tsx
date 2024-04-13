'use client';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Modal, Table, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import useSocket from '../hooks/use-socket';
import { getKiosks, resetMonitoring } from '../../../api/monitoring';
// import sampleData from './sample';

const { Text } = Typography;

export default function Monitoring() {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const { socket } = useSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentKiosk, setCurrentKiosk] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    const result = await getKiosks();
    const kiosks = result.data;
    setDataSource(kiosks);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //test
  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on('monitoring', () => {
  //     socket.emit('screenshot', {
  //       code: 'k3',
  //       data: sampleData.k1,
  //     });
  //   });

  //   socket.on('monitoring-response', () => {
  //     fetchData();
  //   });
  // }, [fetchData, socket]);

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
        dataIndex: 'kioskName',
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
        render: (date: string) => {
          return date ? format(new Date(date), 'yyyy-MM-dd hh:mm:ss') : '-';
        },
      },
      {
        title: '현재화면 스크린샷',
        width: 150,
        render: (data) => {
          return (
            <Button
              size="small"
              onClick={() => {
                setCurrentKiosk(data);
                setIsModalOpen(true);
              }}
            >
              스크린샷
            </Button>
          );
        },
      },
    ];
  }, [dataSource.length]);

  const refresh = useCallback(() => {
    if (socket) {
      setLoading(true);
      resetMonitoring();
      socket.emit('monitoring');
      setTimeout(() => {
        setLoading(false);
        fetchData();
      }, 3000);
    }
  }, [fetchData, socket]);

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
          <Button type="primary" onClick={refresh} loading={loading}>
            새로고침
          </Button>
        </Flex>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Flex>
      <Modal
        width={800}
        title={`${currentKiosk?.kioskName}스크린샷`}
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <img
          style={{ width: '100%' }}
          src={`data:image/jpeg;base64, ${currentKiosk?.data}`}
          alt=""
        />
      </Modal>
    </div>
  );
}
