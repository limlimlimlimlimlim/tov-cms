'use client';
import { Button, Divider, Flex, Form, Input, Select, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import WingSelect from '../../component/wing-select/wing-select';
import FloorSelect from '../../component/floor-select/floor-select';
import { getMapByWingAndFloor } from '../../api/map';
import { createFacility } from '../../api/facility';
import MapViewer from '../../component/map-viewer/map-viewer';
import FacilityPositionManagementModal from '../../component/facility-position-management/facility-position-management-modal';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const { Option } = Select;

const validateMessages = {
  required: '필수 값을 입력해주세요',
  types: {
    email: '유효하지 않은 이메일 주소입니다.',
    number: '유효하지 않은 값입니다.',
  },
};

const FacilityForm = ({ data }) => {
  const router = useRouter();
  const [floor, setFloor] = useState('');
  const [wing, setWing] = useState('');
  const [category, setCategory] = useState(2);
  const [subCategory, setSubCategory] = useState(1);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [iconType, setIconType] = useState('icon1');
  const [alwaysVisible, setAlwaysVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [status, setStatus] = useState('enabled');
  const [map, setMap] = useState<any>();
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    if (!data) return;
    setWing(data.wingId);
    setFloor(data.floorId);
    setCategory(data.categoryId);
    setSubCategory(data.subCategoryId);
    setName(data.name);
    setAddress(data.address);
    setPhone(data.phone);
    setTime(data.time);
    setIconType(data.iconType);
    setAlwaysVisible(data.alwaysVisible);
    setPosition({ x: data.x, y: data.y });
    setStatus(data.status);
  }, [data]);

  const onFinish = useCallback(async () => {
    try {
      await createFacility({
        name,
        phone,
        address,
        time,
        alwaysVisible,
        iconType,
        status,
        floorId: floor,
        wingId: wing,
        categoryId: category,
        subCategoryId: subCategory,
        x: position.x,
        y: position.y,
      });
      void message.success('시설이 생성됐습니다.');
      router.push('/facility/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [
    address,
    alwaysVisible,
    category,
    floor,
    iconType,
    name,
    phone,
    position.x,
    position.y,
    router,
    status,
    subCategory,
    time,
    wing,
  ]);

  const onChangeFloor = useCallback((f: any) => {
    setFloor(f);
  }, []);

  const onChangeWing = useCallback((w) => {
    setWing(w);
    setFloor('');
  }, []);

  const getMap = useCallback(async (wing, floor) => {
    const result = await getMapByWingAndFloor({ wing, floor });
    setMap(result.data.data[0]);
  }, []);

  useEffect(() => {
    if (!wing || !floor) return;
    void getMap(wing, floor);
  }, [wing, floor, getMap]);
  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        <Form.Item label="시설구분">
          <Flex gap="middle">
            <Select
              style={{ width: 150 }}
              defaultValue={category}
              placeholder="선택"
              onChange={(e: any) => {
                setCategory(e.value);
              }}
            >
              <Option key="test2" value={2}>
                test2
              </Option>
            </Select>
            <Select
              style={{ width: 150 }}
              defaultValue={subCategory}
              placeholder="선택"
              onChange={(e: any) => {
                setSubCategory(e.value);
              }}
            >
              <Option key="test1-1" value={1}>
                test1-1
              </Option>
            </Select>
          </Flex>
        </Form.Item>

        <Form.Item label="시설명">
          <Input
            value={name}
            style={{ width: 400 }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="건물선택">
          <Flex gap="middle">
            <WingSelect
              wingId={wing}
              style={{ width: 150 }}
              onChange={onChangeWing}
            />
            <Flex gap="small" align="middle">
              <span style={{ lineHeight: 2.2 }}>층 선택 :</span>

              <FloorSelect
                wingId={wing}
                floorId={floor}
                style={{ width: 150 }}
                onChange={onChangeFloor}
              />
            </Flex>
          </Flex>
        </Form.Item>

        <Form.Item label="연락처">
          <Input
            value={phone}
            style={{ width: 400 }}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="주소">
          <Input
            value={address}
            style={{ width: 400 }}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="운영시간">
          <Input
            value={time}
            style={{ width: 400 }}
            onChange={(e) => {
              setTime(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="시설 아이콘">
          <Select
            style={{ width: 150 }}
            value={iconType}
            onChange={(value) => {
              setIconType(value);
            }}
          >
            <Option key="icon1" value="icon1">
              아이콘1
            </Option>
            <Option key="icon2" value="icon2">
              아이콘2
            </Option>
          </Select>
        </Form.Item>
        {map ? (
          <Form.Item label="지도">
            <Flex vertical gap="small">
              <Button
                style={{ width: 100 }}
                onClick={() => {
                  setIsOpenModal(true);
                }}
              >
                위치설정
              </Button>
              <MapViewer
                mapId={map?.id}
                width={400}
                onClick={null}
                facility={position}
              />
            </Flex>
          </Form.Item>
        ) : null}
        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Flex gap="small" justify="end">
            <Link href="/facility/list">
              <Button>취소</Button>
            </Link>
            <Button type="primary" htmlType="submit">
              등록
            </Button>
          </Flex>
        </Form.Item>
      </Form>
      <FacilityPositionManagementModal
        mapId={map?.id}
        open={isOpenModal}
        position={position}
        onOk={(data) => {
          setPosition(data.position);
          setAlwaysVisible(data.alwaysVisible);
        }}
        onCancel={() => {
          setIsOpenModal(false);
        }}
      />
    </Flex>
  );
};

export default FacilityForm;
