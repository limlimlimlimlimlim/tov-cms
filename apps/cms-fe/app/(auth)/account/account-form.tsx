import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  message,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createUser, updateUser } from '../../../api/account';
import { getPermissions } from '../../../api/permission';
import { getFacilityAll } from '../../../api/facility';

const { Option } = Select;
const { confirm } = Modal;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 21 },
};

const validateMessages = {
  required: '필수 값을 입력해주세요',
  types: {
    email: '유효하지 않은 이메일 주소입니다.',
    number: '유효하지 않은 값입니다.',
  },
};

const AccountForm = ({ data }) => {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [permissionId, setPermissionId] = useState('');
  const [facilityId, setFacilityId] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const newPassword = useRef('');
  const newPasswordConfirm = useRef('');

  useEffect(() => {
    if (!data) return;
    setIsEdit(true);
    setUserId(data.userId);
    setPassword(data.password);
    setName(data.name);
    setPhone(data.phone);
    setDescription(data.description);
    setPermissionId(data.permissionId);
    setFacilityId(data.facilityId);
  }, [data]);

  const onFinish = useCallback(async () => {
    try {
      if (!isEdit && password !== passwordConfirm) {
        void message.warning('비밀번호를 확인해주세요');
      }
      if (isEdit) {
        await updateUser(data.userId, {
          password,
          name,
          phone,
          description,
          permissionId,
          facilityId,
        });
        void message.success('계정이 수정됐습니다.');
      } else {
        await createUser({
          userId,
          password,
          name,
          phone,
          description,
          permissionId,
          facilityId,
        });
        void message.success('계정이 생성됐습니다.');
      }
      router.push('/account/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [
    data,
    description,
    facilityId,
    isEdit,
    name,
    password,
    passwordConfirm,
    permissionId,
    phone,
    router,
    userId,
  ]);

  const fetchPermissions = useCallback(async () => {
    const result = await getPermissions();
    setPermissions(result.data);
  }, []);

  const fetchFacilities = useCallback(async () => {
    const result = await getFacilityAll();
    setFacilities(result.data.data);
  }, []);

  useEffect(() => {
    void fetchPermissions();
    void fetchFacilities();
  }, [fetchFacilities, fetchPermissions]);

  const onChangeUserId = useCallback(({ target }) => {
    setUserId(target.value);
  }, []);

  const onChangePassword = useCallback(({ target }) => {
    setPassword(target.value);
  }, []);

  const onChangePasswordConfirm = useCallback(({ target }) => {
    setPasswordConfirm(target.value);
  }, []);

  const onChangeName = useCallback(({ target }) => {
    setName(target.value);
  }, []);

  const onChangePhone = useCallback(({ target }) => {
    setPhone(target.value);
  }, []);

  const onChangeDecription = useCallback(({ target }) => {
    setDescription(target.value);
  }, []);

  const onChangePermission = useCallback((value: string) => {
    setPermissionId(value);
  }, []);

  const onChangeFacility = useCallback((value: string) => {
    setFacilityId(value);
  }, []);

  const createPermissionItems = useCallback(() => {
    return permissions.map((permission: any) => {
      return (
        <Option key={permission.id} value={permission.id}>
          {permission.name}
        </Option>
      );
    });
  }, [permissions]);

  const createFacilityItems = useCallback(() => {
    return facilities.map((facility: any) => {
      return (
        <Option key={facility.id} value={facility.id}>
          {facility.name}
        </Option>
      );
    });
  }, [facilities]);

  //   const confirmChangePassword = useCallback(() => {
  //     confirm({
  //       title: '비밀번호 변경 확인',
  //       okText: '확인',
  //       cancelText: '취소',
  //       content: '새로 등록한 비밀번호로 변경하시겠습니까?',
  //       onOk() {
  //         void message.success('비밀번호가 변경 됐습니다.');
  //       },
  //     });
  //   }, []);

  const onClickChangePassword = useCallback(() => {
    confirm({
      title: '비밀번호 변경',
      okText: '확인',
      cancelText: '취소',
      content: (
        <Flex vertical gap="middle">
          새로운 비밀번호를 입력해주세요.
          <Form labelCol={{ span: 7 }}>
            <Form.Item label="비밀번호">
              <Input
                type="password"
                onChange={({ target }) => {
                  newPassword.current = target.value;
                }}
              />
            </Form.Item>
            <Form.Item label="비밀번호 확인">
              <Input
                type="password"
                onChange={({ target }) => {
                  newPasswordConfirm.current = target.value;
                }}
              />
            </Form.Item>
          </Form>
        </Flex>
      ),
      async onOk() {
        if (newPassword.current !== newPasswordConfirm.current) {
          void message.warning('비밀번호를 확인해주세요');
          return;
        }
        await updateUser(data.userId, { password: newPassword.current });
        setPassword(newPassword.current);
        void message.success('비밀번호가 변경됐습니다.');
      },
    });
  }, [data, newPassword, newPasswordConfirm]);

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 500 }}
        validateMessages={validateMessages}
      >
        <Flex style={{ width: '100%' }}>
          <Flex vertical style={{ width: '100%' }}>
            <Form.Item label="아이디" rules={[{ required: true }]}>
              <Input
                value={userId}
                onChange={onChangeUserId}
                disabled={isEdit}
              />
            </Form.Item>
            <Form.Item label="비밀번호" rules={[{ required: true }]}>
              <Input
                value={password}
                type="password"
                onChange={onChangePassword}
                disabled={isEdit}
              />
              {isEdit && (
                <Button onClick={onClickChangePassword}>비밀번호 변경</Button>
              )}
            </Form.Item>
            {!isEdit && (
              <Form.Item label="비밀번호 확인" rules={[{ required: true }]}>
                <Input
                  value={passwordConfirm}
                  type="password"
                  onChange={onChangePasswordConfirm}
                />
              </Form.Item>
            )}
            <Form.Item label="권한">
              <Select onChange={onChangePermission} value={permissionId}>
                {createPermissionItems()}
              </Select>
            </Form.Item>
            <Form.Item label="이름" rules={[{ required: true }]}>
              <Input value={name} onChange={onChangeName} />
            </Form.Item>
            <Form.Item label="연락처">
              <Input value={phone} onChange={onChangePhone} />
            </Form.Item>
            <Form.Item label="설명">
              <Input.TextArea
                value={description}
                style={{ height: 200 }}
                onChange={onChangeDecription}
              />
            </Form.Item>
          </Flex>
        </Flex>

        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
          <Flex gap="small" justify="end">
            <Link href="/account/list">
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

export default AccountForm;
