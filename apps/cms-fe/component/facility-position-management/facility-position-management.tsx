'use client';

import { Button, ColorPicker, Flex, Form, Select, Slider, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import MapViewer from '../map-viewer/map-viewer';
import { getMapDetail } from '../../api/map';

const { Option } = Select;
const fontSizeOptions = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];

export default function FacilityPositionManagement({
  mapId,
  facility,
  iconUrl,
  onChange,
}) {
  const [enabledPositionSetting, setEnabledPositionSetting] = useState<any>();
  const [originPosition, setOriginPosition] = useState<any>({
    x: facility.x,
    y: facility.y,
  });
  const [alwaysVisible, setAlwaysVisible] = useState(false);
  const [fontSize, setFontSize] = useState();
  const [iconColor, setIconColor] = useState();
  const [tooltipColor, setTooltipColor] = useState();
  const [currentSection, setCurrentSection] = useState<any>();
  const [currentSectionColor, setCurrentSectionColor] = useState<string>();
  const [currentSectionStrokeColor, setCurrentSectionStrokeColor] =
    useState<string>();
  const [currentSectionStrokeWidth, setCurrentSectionStrokeWidth] =
    useState<number>();
  const [sections, setSections] = useState<any>();
  const [image, setImage] = useState();

  const onClickMap = useCallback(
    (data) => {
      console.log('currnetSection : ', data.section, sections);
      setOriginPosition({ x: data.originX, y: data.originY });
      setCurrentSection(data.section);
      onChange({
        position: { x: data.originX, y: data.originY },
        alwaysVisible,
        fontSize,
        section: data.section,
      });
    },
    [alwaysVisible, fontSize, onChange, sections],
  );

  useEffect(() => {
    setFontSize(facility.fontSize || 12);
    setIconColor(facility.iconColor || '#ff9900');
    setTooltipColor(facility.tooltipColor || '#000000');
    setCurrentSection(facility.section || null);
  }, [
    facility.fontSize,
    facility.iconColor,
    facility.section,
    facility.tooltipColor,
  ]);

  useEffect(() => {
    if (!currentSection) {
      return;
    }
    setCurrentSectionColor(
      addAlpha(currentSection.color, currentSection.alpha),
    );
    setCurrentSectionStrokeColor(currentSection.strokeColor);
    setCurrentSectionStrokeWidth(currentSection.strokeWidth);
  }, [currentSection]);

  const addAlpha = (color: string, alpha: number) => {
    // coerce values so ti is between 0 and 1.
    const _alpha = Math.round(
      Math.min(Math.max(alpha * 0.01 || 1, 0), 1) * 255,
    );
    return color + _alpha.toString(16).toUpperCase();
  };

  const fetchData = useCallback(async (mapId) => {
    const result = await getMapDetail(mapId);
    setSections(result.data.sections);
    setImage(result.data.image);
  }, []);

  useEffect(() => {
    setEnabledPositionSetting(true);
    if (mapId) {
      void fetchData(mapId);
    }
  }, [fetchData, mapId]);

  const hasResource = useCallback(() => {
    return image && sections;
  }, [image, sections]);

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="middle">
          <Form.Item label="위치 설정">
            <Switch
              checked={enabledPositionSetting}
              onChange={(checked) => {
                setEnabledPositionSetting(checked);
              }}
            />
          </Form.Item>
          {/* <Form.Item label="상시표시">
            <Switch
              checked={alwaysVisible}
              onChange={(check) => {
                setAlwaysVisible(check);
                onChange({
                  position: originPosition,
                  alwaysVisible: check,
                  sectionId,
                });
              }}
            />
          </Form.Item> */}
          <Form.Item label="폰트 사이즈">
            <Select style={{ width: 80 }} value={fontSize}>
              {fontSizeOptions.map((fontSize) => (
                <Option key={fontSize} value={fontSize}>
                  {fontSize}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="영역 색상">
            <ColorPicker format="hex" value={currentSectionColor} />
          </Form.Item>
          <Form.Item label="테두리 색상">
            <ColorPicker format="hex" value={currentSectionStrokeColor} />
          </Form.Item>
          <Form.Item label="테두리 두께">
            <Slider
              min={1}
              max={10}
              style={{ width: 80 }}
              value={currentSectionStrokeWidth}
            />
          </Form.Item>
          <Form.Item label="아이콘 색상">
            <ColorPicker format="hex" value={iconColor} />
          </Form.Item>
          <Form.Item label="말풍선 색상">
            <ColorPicker format="hex" value={tooltipColor} />
          </Form.Item>
        </Flex>

        <Flex gap="middle">
          <Button
          // onClick={() => {
          //   setOriginPosition(null);
          //   onChange({
          //     position: null,
          //     alwaysVisible,
          //     sectionId,
          //   });
          // }}
          >
            초기화
          </Button>
        </Flex>
      </Flex>
      <Flex justify="center" style={{ overflow: 'auto' }}>
        {hasResource() && (
          <MapViewer
            sections={sections}
            image={image}
            width={900}
            facility={originPosition}
            facilityIconUrl={iconUrl}
            onClick={(data) => {
              if (enabledPositionSetting) {
                onClickMap(data);
              }
            }}
          />
        )}
      </Flex>
    </Flex>
  );
}
