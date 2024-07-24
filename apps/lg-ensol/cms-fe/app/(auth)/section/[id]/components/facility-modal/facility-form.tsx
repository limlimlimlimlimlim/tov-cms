'use client';
import { Button, Divider, Flex, Form, Input, message } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import WingSelect from '../../../../../../component/wing-select/wing-select';
import FloorSelect from '../../../../../../component/floor-select/floor-select';
import { createFacility, updateFacility } from '../../../../../../api/facility';
import { updateSectionPaintOptionById } from '../../../../../../api/section';
import CategorySelect from '../../../../../../component/category-select/category-select';
import SubCategorySelect from '../../../../../../component/sub-category-select/sub-category-select';
import { SectionContext } from '../../section-context';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const validateMessages = {
  required: '필수 값을 입력해주세요',
  types: {
    email: '유효하지 않은 이메일 주소입니다.',
    number: '유효하지 않은 값입니다.',
  },
};

const FacilityForm = ({ data, onComplete }) => {
  const { hideFacilityDetail, mapData } = useContext<any>(SectionContext);
  const router = useRouter();
  const [isEdit, setIsEdit] = useState(false);
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
    section: null,
    padding: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });

  useEffect(() => {
    if (data) {
      setIsEdit(true);
      setFacility({
        ...data,
        categoryId: data.category.id,
        subCategoryId: data.subCategory.id,
        sectionId: data.sectionId,
      });
      setWingId(data.wingId);
      setFloorId(data.floorId);
    } else {
      setIsEdit(false);
      setFacility({
        wingId: mapData.wing.id,
        floorId: mapData.floor.id,
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
        section: null,
        padding: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        },
      });
      setWingId(mapData.wing.id);
      setFloorId(mapData.floor.id);
    }
  }, [data, mapData]);

  const onFinish = useCallback(async () => {
    if (isEdit) {
      const { section } = facility;

      await updateFacility(facility.id, {
        name: facility.name,
        phone: facility.phone,
        address: facility.address,
        description: facility.description,
        iconType: facility.iconType,
        status: facility.status,
        x: facility.x,
        y: facility.y,
        wingId,
        floorId,
        tags: facility.tags,
        fontSize: facility.fontSize,
        iconColor: facility.iconColor,
        tooltipColor: facility.tooltipColor,
        paddingTop: facility.paddingTop,
        paddingBottom: facility.paddingBottom,
        paddingRight: facility.paddingRight,
        paddingLeft: facility.paddingLeft,
        sectionId: facility.section?.id,
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

      await createFacility({
        name: facility.name,
        phone: facility.phone,
        address: facility.address,
        description: facility.description,
        iconType: facility.iconType,
        status: facility.status,
        x: facility.x,
        y: facility.y,
        wingId,
        floorId,
        tags: facility.tags,
        fontSize: facility.fontSize,
        iconColor: facility.iconColor,
        tooltipColor: facility.tooltipColor,
        paddingTop: facility.paddingTop,
        paddingBottom: facility.paddingBottom,
        paddingRight: facility.paddingRight,
        paddingLeft: facility.paddingLeft,
        sectionId: facility.section?.id,
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

      void message.success('시설이 생성됐습니다.');
    }
    hideFacilityDetail();
    onComplete();
    router.replace(`${window.location.pathname}?t=${Date.now()}`);
  }, [
    isEdit,
    hideFacilityDetail,
    onComplete,
    router,
    facility,
    wingId,
    floorId,
  ]);

  return (
    <Flex vertical gap="middle">
      <Form
        {...layout}
        onFinish={onFinish}
        style={{ maxWidth: 1000 }}
        validateMessages={validateMessages}
      >
        {/* <Form.Item label="시설구분">
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
        </Form.Item> */}

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
        <Divider />
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Flex gap="small" justify="end">
            <Button
              onClick={() => {
                hideFacilityDetail();
                onComplete();
              }}
            >
              취소
            </Button>
            <Button type="primary" htmlType="submit">
              등록
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default FacilityForm;
