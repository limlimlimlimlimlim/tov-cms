'use client';
import { Button, Divider, Flex, Form, Input, Select, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import WingSelect from '../../../component/wing-select/wing-select';
import FloorSelect from '../../../component/floor-select/floor-select';
import { getMapByWingAndFloor } from '../../../api/map';
import { createFacility, updateFacility } from '../../../api/facility';
import { MapViewer } from '../../../component/map-viewer/map-viewer';
import FacilityPositionManagementModal from '../../../component/facility-position-management/facility-position-management-modal';
import CategorySelect from '../../../component/category-select/category-select';
import SubCategorySelect from '../../../component/sub-category-select/sub-category-select';
import { updateSectionPaintOptionById } from '../../../api/section';

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
  const [map, setMap] = useState<any>();
  const [mapSections, setMapSections] = useState<any>([]);
  const [originMapSections, setOriginMapSections] = useState<any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [iconUrl, setIconUrl] = useState('/pin01.png');
  const [wingId, setWingId] = useState();
  const [floorId, setFloorId] = useState<any>();
  const [facility, setFacility] = useState<any>({
    wingId: '',
    floorId: '',
    categoryId: '',
    subCategoryId: '',
    name: '',
    address: '',
    phone: '',
    description: '',
    tags: '',
    iconType: 'icon1',
    alwaysVisible: true,
    x: 0,
    y: 0,
    status: 'enabled',
    sectionId: null,
  });

  const getMap = useCallback(
    async (wing, floor) => {
      if (!facility) return;
      if (!wingId || !floorId) return;
      const result = await getMapByWingAndFloor({ wing, floor });
      const map = result.data.data[0];
      setMap(map);
      const sections = map.sections;
      setMapSections(sections);
      setOriginMapSections(JSON.parse(JSON.stringify(sections)));
      // const f = sections
      //   .map((s) => s.facilities)
      //   .flat()
      //   .find((f) => f.id === facility.id);
      // setFacility({ ...facility, x: f.x, y: f.y });
    },
    [facility, floorId, wingId],
  );

  useEffect(() => {
    if (data) {
      setIsEdit(true);

      setFacility({
        ...data,
        categoryId: data.category.id,
        subCategoryId: data.subCategory.id,
        sectionId: data.section?.id,
      });
      setWingId(data.wingId);
      setFloorId(data.floorId);
    }
  }, [data]);

  useEffect(() => {
    void getMap(wingId, floorId);
  }, [wingId, floorId, getMap]);

  useEffect(() => {
    switch (facility.iconType) {
      case 'icon1':
        setIconUrl('/pin01.png');
        break;
      case 'icon2':
        setIconUrl('/pin02.png');
        break;
    }
  }, [facility.iconType]);

  const onFinish = useCallback(async () => {
    try {
      if (isEdit) {
        const { section } = facility;
        const temp = { ...facility };
        delete temp.category;
        delete temp.subCategory;
        delete temp.floor;
        delete temp.section;
        delete temp.wing;
        delete temp.map;

        await updateFacility(facility.id, {
          ...temp,
        });

        if (section) {
          const paintOptions = {
            color: section.color,
            alpha: section.alpha,
            strokeWidth: section.strokeWidth,
            strokeColor: section.strokeColor,
            strokeAlpha: section.strokeAlpha,
          };

          let promises;
          if (section.group) {
            promises = section.group.sections.map(async (s) =>
              updateSectionPaintOptionById(s.id, paintOptions),
            );
          } else {
            promises = [updateSectionPaintOptionById(section.id, paintOptions)];
          }
          await Promise.all(promises);
        }

        void message.success('시설이 수정됐습니다.');
      } else {
        const { section } = facility;
        const temp = { ...facility };
        delete temp.category;
        delete temp.subCategory;
        delete temp.floor;
        delete temp.section;
        delete temp.wing;
        delete temp.map;
        await createFacility({
          ...temp,
        });

        const paintOptions = {
          color: section.color,
          alpha: section.alpha,
          strokeWidth: section.strokeWidth,
          strokeColor: section.strokeColor,
          strokeAlpha: section.strokeAlpha,
        };

        let promises;
        if (section.group) {
          promises = section.group.sections.map(async (s) =>
            updateSectionPaintOptionById(s.id, paintOptions),
          );
        } else {
          promises = [updateSectionPaintOptionById(section.id, paintOptions)];
        }
        await Promise.all(promises);

        void message.success('시설이 생성됐습니다.');
      }

      router.push('/facility/list');
    } catch (e) {
      void message.error(e.message);
    }
  }, [isEdit, router, facility]);

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
            <CategorySelect
              id={facility.categoryId}
              style={{ width: 150 }}
              onChange={(value: any) => {
                setFacility({ ...facility, categoryId: value });
              }}
            />
            <SubCategorySelect
              id={facility.subCategoryId}
              categoryId={facility.categoryId}
              style={{ width: 150 }}
              onChange={(value: any) => {
                setFacility({ ...facility, subCategoryId: value });
              }}
            />
          </Flex>
        </Form.Item>

        <Form.Item label="시설명">
          <Input
            value={facility.name}
            style={{ width: 400 }}
            onChange={(e) => {
              setFacility({ ...facility, name: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="건물선택">
          <Flex gap="middle">
            <WingSelect
              wingId={facility.wingId}
              style={{ width: 150 }}
              onChange={(wingId) => {
                setFacility({ ...facility, wingId, floorId: '' });
                setWingId(wingId);
                setFloorId(null);
              }}
            />
            <Flex gap="small" align="middle">
              <span style={{ lineHeight: 2.2 }}>층 선택 :</span>

              <FloorSelect
                wingId={facility.wingId}
                floorId={facility.floorId}
                style={{ width: 150 }}
                onChange={(f) => {
                  setFacility({ ...facility, floorId: f });
                  setWingId(wingId);
                  setFloorId(f);
                }}
              />
            </Flex>
          </Flex>
        </Form.Item>

        <Form.Item label="연락처">
          <Input
            value={facility.phone}
            style={{ width: 400 }}
            onChange={(e) => {
              setFacility({ ...facility, phone: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="주소">
          <Input
            value={facility.address}
            style={{ width: 400 }}
            onChange={(e) => {
              setFacility({ ...facility, address: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="설명">
          <TextArea
            value={facility.description}
            style={{ width: 400, height: 200 }}
            onChange={(e) => {
              setFacility({ ...facility, description: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="태그">
          <Input
            value={facility.tags}
            style={{ width: 400 }}
            onChange={(e) => {
              setFacility({ ...facility, tags: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="시설 아이콘">
          <Select
            style={{ width: 150 }}
            value={facility.iconType}
            onChange={(value) => {
              setFacility({ ...facility, iconType: value });
            }}
          >
            <Option key="icon1" value="icon1">
              <img
                src="/pin01.png"
                alt="pin01"
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 10,
                }}
              />
              아이콘1
            </Option>
            <Option key="icon2" value="icon2">
              <img
                src="/pin02.png"
                alt="pin02"
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 10,
                }}
              />
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
                image={map.image}
                sections={mapSections}
                width={400}
                onClick={null}
                facilityIconUrl={iconUrl}
                facility={facility}
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
        facility={facility}
        iconUrl={iconUrl}
        mapSections={mapSections}
        onChangeSection={() => {
          setMapSections([...originMapSections]);
        }}
        onOk={(data) => {
          setFacility({
            ...facility,
            ...data.position,
            fontSize: data.fontSize,
            iconColor: data.iconColor,
            tooltipColor: data.tooltipColor,
            padding: data.padding,
            section: data.section,
            sectionId: data.section?.id,
          });

          if (data.section) {
            const paintOptions = {
              color: data.section.color,
              alpha: data.section.alpha,
              strokeWidth: data.section.strokeWidth,
              strokeColor: data.section.strokeColor,
              strokeAlpha: data.section.strokeAlpha,
            };

            const _mapSections = [...mapSections];
            if (data.section.group) {
              data.section.group.sections.forEach((s) => {
                const index = _mapSections.findIndex((ss) => s.id === ss.id);
                _mapSections[index] = {
                  ..._mapSections[index],
                  ...paintOptions,
                };
              });
            } else {
              const index = _mapSections.findIndex(
                (s) => s.id === data.section.id,
              );
              _mapSections[index] = { ...data.section };
            }

            setMapSections(_mapSections);
          }

          setIsOpenModal(false);
        }}
        onCancel={() => {
          setIsOpenModal(false);
        }}
      />
    </Flex>
  );
};

export default FacilityForm;
