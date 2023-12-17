'use client';
import { Button, Flex, Table, Modal, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { PermissionItem } from '../../../../interface/permission';
import { deletePermission, getPermissions } from '../../../../api/permission';
import usePermission from '../../hooks/use-permission';

const { confirm } = Modal;

export default function PermissionList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<PermissionItem[]>([]);
  const [selectedData, setSelectedData] = useState<PermissionItem[]>([]);
  const { ready, getPermissionPermissions }: any = usePermission();
  const [writable, setWritable] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [updatable, setUpdatable] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const permissions = await getPermissions();
    setData(permissions.data);
    setTotal(permissions.data.length);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const result = getPermissionPermissions();
    if (!result.read) {
      router.replace('/error/403');
      return;
    }
    setWritable(result.write);
    setDeletable(result.delete);
    setUpdatable(result.update);
    void fetchData();
  }, [fetchData, getPermissionPermissions, ready, router]);

  const columns: ColumnsType<PermissionItem> = useMemo(() => {
    return [
      {
        title: '번호',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '권한명',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '설명',
        dataIndex: 'description',
      },
      {
        title: '최종 수정일',
        dataIndex: 'updatedAt',
        width: 180,
        render: (date: string) => format(new Date(date), 'yyyy-MM-dd hh:mm:ss'),
      },
      {
        title: '',
        width: 80,
        render: (value: any) => {
          return (
            <>
              {updatable && (
                <Link href={`/permission/edit/${(value as any).id}`}>
                  <Button size="small" type="text">
                    <EditOutlined />
                  </Button>
                </Link>
              )}
            </>
          );
        },
      },
    ];
  }, [updatable]);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '권한 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 권한을 삭제하시겠습니까?',
      async onOk() {
        await Promise.all(
          selectedData.map((select: any) => deletePermission(select.id)),
        );
        void message.success('선택된 권한이 삭제됐습니다.');
        await fetchData();
      },
    });
  }, [fetchData, selectedData]);

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: PermissionItem[],
    ) => {
      setSelectedData(selectedRows);
    },
  };

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="small" align="center">
          {deletable && (
            <Button
              danger
              disabled={data.length === 0 || selectedData.length === 0}
              onClick={onClickDelete}
            >
              삭제
            </Button>
          )}

          {writable && (
            <Link href="/permission/register">
              <Button type="primary">등록</Button>
            </Link>
          )}

          <span>Total : {total}</span>
        </Flex>
      </Flex>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 50 }}
        scroll={{ y: 750 }}
        rowKey="id"
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
      />
    </Flex>
  );
}
