import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Form,
  Input,
  Table,
  message,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPermission, updatePermission } from '../../api/permission';

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const defaultDataSource = [
  {
    key: '1',
    depth1: '계정관리',
    depth2: '계정관리',
    code: 'account',
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: '2',
    depth1: '계정관리',
    depth2: '권한관리',
    code: 'permission',
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: '3',
    depth1: '스케줄',
    depth2: '',
    code: 'schedule',
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: '4',
    depth1: '게시물',
    depth2: '',
    code: 'post',
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: '5',
    depth1: '지도관리',
    depth2: '층별지도',
    code: 'map',
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: '6',
    depth1: '지도관리',
    depth2: '지도정보',
    code: 'map-info',
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: '7',
    depth1: '시설관리',
    depth2: '',
    code: 'facility',
    read: false,
    write: false,
    update: false,
    delete: false,
  },
  {
    key: '8',
    depth1: '키오스크관리',
    depth2: '',
    code: 'kiosk',
    read: false,
    write: false,
    update: false,
    delete: false,
  },
];

const PermissionForm = ({ data }) => {
  const router = useRouter();
  const [dataSource, setDataSource] = useState(
    JSON.parse(JSON.stringify(defaultDataSource)),
  );
  const [currentSelectedRowKeys, setCurrentSelectedRowKeys] = useState<
    React.Key[]
  >([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const upatePermission = useCallback(
    (key, type, checked) => {
      const data = [...dataSource];
      const target = data.find((item) => item.key === key);
      if (!target) return;
      target[type] = checked;
      setDataSource(data);
    },
    [dataSource],
  );

  const upatePermissionAll = useCallback(
    (key, checked) => {
      const data = [...dataSource];
      const target = data.find((item) => item.key === key);
      if (!target) return;
      target.read = checked;
      target.write = checked;
      target.update = checked;
      target.delete = checked;
      setDataSource(data);
    },
    [dataSource],
  );

  const columns = [
    {
      title: '대메뉴',
      dataIndex: 'depth1',
      key: 'depth1',
    },
    {
      title: '소메뉴',
      dataIndex: 'depth2',
      key: 'depth2',
    },
    {
      title: '보기',
      key: 'read',
      render: (value: any) => {
        return (
          <Checkbox
            checked={value.read}
            onChange={() => upatePermission(value.key, 'read', !value.read)}
          />
        );
      },
    },
    {
      title: '등록',
      key: 'write',
      render: (value: any) => (
        <Checkbox
          checked={value.write}
          onChange={() => upatePermission(value.key, 'write', !value.write)}
        />
      ),
    },
    {
      title: '수정',
      key: 'update',
      render: (value: any) => (
        <Checkbox
          checked={value.update}
          onChange={() => upatePermission(value.key, 'update', !value.update)}
        />
      ),
    },
    {
      title: '삭제',
      key: 'delete',
      render: (value: any) => (
        <Checkbox
          checked={value.delete}
          onChange={() => upatePermission(value.key, 'delete', !value.delete)}
        />
      ),
    },
  ];

  useEffect(() => {
    if (!data) return;
    setIsEdit(true);
    setName(data.name);
    setDescription(data.description);
    const account: any = dataSource.find((ds) => ds.code === 'account');
    account.read = data.readAccount;
    account.write = data.writeAccount;
    account.delete = data.deleteAccount;
    account.update = data.editAccount;

    const permission: any = dataSource.find((ds) => ds.code === 'permission');
    permission.read = data.readPermission;
    permission.write = data.writePermission;
    permission.delete = data.deletePermission;
    permission.update = data.editPermission;

    const schedule: any = dataSource.find((ds) => ds.code === 'schedule');
    schedule.read = data.readSchedule;
    schedule.write = data.writeSchedule;
    schedule.delete = data.deleteSchedule;
    schedule.update = data.editSchedule;

    const post: any = dataSource.find((ds) => ds.code === 'post');
    post.read = data.readPost;
    post.write = data.writePost;
    post.delete = data.deletePost;
    post.update = data.editPost;

    const map: any = dataSource.find((ds) => ds.code === 'map');
    map.read = data.readMap;
    map.write = data.writeMap;
    map.delete = data.deleteMap;
    map.update = data.editMap;

    const mapInfo: any = dataSource.find((ds) => ds.code === 'map-info');
    mapInfo.read = data.readMapInfo;
    mapInfo.write = data.writeMapInfo;
    mapInfo.delete = data.deleteMapInfo;
    mapInfo.update = data.editMapInfo;

    const facility: any = dataSource.find((ds) => ds.code === 'facility');
    facility.read = data.readFacility;
    facility.write = data.writeFacility;
    facility.delete = data.deleteFacility;
    facility.update = data.editFacility;

    const kiosk: any = dataSource.find((ds) => ds.code === 'kiosk');
    kiosk.read = data.readKiosk;
    kiosk.write = data.writeKiosk;
    kiosk.delete = data.deleteKiosk;
    kiosk.update = data.editKiosk;

    setDataSource([
      account,
      permission,
      schedule,
      post,
      map,
      mapInfo,
      facility,
      kiosk,
    ]);
  }, [data]);

  const onFinish = useCallback(async () => {
    try {
      const permissionMap = dataSource.reduce((acc: any, data) => {
        const { code } = data;
        switch (code) {
          case 'account':
            acc.readAccount = data.read;
            acc.writeAccount = data.write;
            acc.editAccount = data.update;
            acc.deleteAccount = data.delete;
            break;
          case 'permission':
            acc.readPermission = data.read;
            acc.writePermission = data.write;
            acc.editPermission = data.update;
            acc.deletePermission = data.delete;
            break;
          case 'schedule':
            acc.readSchedule = data.read;
            acc.writeSchedule = data.write;
            acc.editSchedule = data.update;
            acc.deleteSchedule = data.delete;
            break;
          case 'post':
            acc.readPost = data.read;
            acc.writePost = data.write;
            acc.editPost = data.update;
            acc.deletePost = data.delete;
            break;
          case 'map':
            acc.readMap = data.read;
            acc.writeMap = data.write;
            acc.editMap = data.update;
            acc.deleteMap = data.delete;
            break;
          case 'map-info':
            acc.readMapInfo = data.read;
            acc.writeMapInfo = data.write;
            acc.editMapInfo = data.update;
            acc.deleteMapInfo = data.delete;
            break;
          case 'facility':
            acc.readFacility = data.read;
            acc.writeFacility = data.write;
            acc.editFacility = data.update;
            acc.deleteFacility = data.delete;
            break;
          case 'kiosk':
            acc.readKiosk = data.read;
            acc.writeKiosk = data.write;
            acc.editKiosk = data.update;
            acc.deleteKiosk = data.delete;
            break;
        }

        return acc;
      }, {});
      permissionMap.name = name;
      permissionMap.description = description;

      if (isEdit) {
        await updatePermission(data.id, permissionMap);
        void message.success('권한이 수정됐습니다.');
      } else {
        await createPermission(permissionMap);
        void message.success('권한이 생성됐습니다.');
      }

      router.push('/permission/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [data?.id, dataSource, description, isEdit, name, router]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      currentSelectedRowKeys.forEach((key) => upatePermissionAll(key, false));
      selectedRowKeys.forEach((key) => upatePermissionAll(key, true));
      setCurrentSelectedRowKeys(selectedRowKeys);
    },
  };

  const onChangeName = useCallback(({ target }) => {
    setName(target.value);
  }, []);

  const onChangeDescription = useCallback(({ target }) => {
    setDescription(target.value);
  }, []);

  return (
    <Flex vertical gap="middle">
      <Form {...layout} onFinish={onFinish} style={{ maxWidth: 1000 }}>
        <Form.Item label="권한명" rules={[{ required: true }]}>
          <Input value={name} style={{ width: 250 }} onChange={onChangeName} />
        </Form.Item>
        <Form.Item label="설명" rules={[{ required: true }]}>
          <Input
            value={description}
            style={{ width: 250 }}
            onChange={onChangeDescription}
          />
        </Form.Item>
        <Form.Item label="권한 설정" style={{ marginBottom: 10 }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
          />
        </Form.Item>

        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Link href="/permission/list">
              <Button>취소</Button>
            </Link>
            <Button type="primary" htmlType="submit">
              등록
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default PermissionForm;
