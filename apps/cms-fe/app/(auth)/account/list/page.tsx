'use client';
import { Button, Flex, Input, Modal, Table, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { EditOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { AccountItem } from '../../../../interface/account';
import { deleteUser, getUsers } from '../../../../api/account';
import usePermission from '../../hooks/use-permission';

const { Search } = Input;
const { confirm } = Modal;

export default function AccountList() {
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<AccountItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const count = useMemo(() => 50, []);
  const [selectedData, setSelectedData] = useState<AccountItem[]>([]);
  const { ready, getAccountPermissions }: any = usePermission();
  const [writable, setWritable] = useState(false);
  const [deletable, setDeletable] = useState(false);
  const [updatable, setUpdatable] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async ({ keyword, page, count }) => {
    const permissions = await getUsers({ keyword, page, count });
    setData(permissions.data.data);
    setTotal(permissions.data.total);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const result = getAccountPermissions();

    if (!result.read) {
      router.replace('/error/403');
      return;
    }
    setWritable(result.write);
    setDeletable(result.delete);
    setUpdatable(result.update);
    setPage(1);
    void fetchData({ keyword, page, count });
  }, [count, fetchData, getAccountPermissions, keyword, page, ready, router]);

  const columns: ColumnsType<AccountItem> = useMemo(() => {
    return [
      {
        title: '번호',
        width: 80,
        render: (_, __, index) => {
          return index + 1;
        },
      },
      {
        title: '이름',
        dataIndex: 'name',
        width: 150,
      },
      {
        title: '아이디',
        dataIndex: 'userId',
        width: 150,
      },
      {
        title: '권한',
        width: 150,
        render: (data: any) => data.permission.name,
      },
      {
        title: '등록일',
        dataIndex: 'createdAt',
        width: 180,
        render: (date: string) => format(new Date(date), 'yyyy-MM-dd hh:mm:ss'),
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
                <Link href={`/account/edit/${(value as any).userId}`}>
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

  const onSearch = useCallback((value) => {
    setKeyword(value);
  }, []);

  const onClickDelete = useCallback(() => {
    confirm({
      title: '계정 삭제 확인',
      okText: '확인',
      cancelText: '취소',
      content: '선택된 계정을 삭제하시겠습니까?',
      async onOk() {
        await Promise.all(
          selectedData.map((select: any) => deleteUser(select.userId)),
        );
        void message.success('선택된 계정이 삭제됐습니다.');
        setPage(1);
        await fetchData({ keyword, page, count });
      },
    });
  }, [count, fetchData, keyword, page, selectedData]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: AccountItem[]) => {
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
            <Link href="/account/register">
              <Button type="primary">등록</Button>
            </Link>
          )}

          <span>Total : {total}</span>
        </Flex>
        <Flex>
          <Search
            placeholder="검색어를 입력해주세요."
            onSearch={onSearch}
            style={{ width: 300 }}
          />
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
