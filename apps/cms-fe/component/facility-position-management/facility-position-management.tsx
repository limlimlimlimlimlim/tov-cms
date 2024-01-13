'use client';

import { Button, ColorPicker, Flex, Form, Select, Slider, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import MapViewer from '../map-viewer/map-viewer';

const { Option } = Select;
const fontSizeOptions = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];

export default function FacilityPositionManagement({
  mapId,
  position,
  iconUrl,
  onChange,
}) {
  const [enabledPositionSetting, setEnabledPositionSetting] = useState<any>();
  const [originPosition, setOriginPosition] = useState<any>({ ...position });
  const [alwaysVisible, setAlwaysVisible] = useState(false);
  const [sectionId, setSectionId] = useState();
  const [fontSize, setFontSize] = useState(12);
  const [currentSection, setCurrentSection] = useState();
  const onClickMap = useCallback(
    (data) => {
      setSectionId(data.section);
      setOriginPosition({ x: data.originX, y: data.originY });
      onChange({
        position: { x: data.originX, y: data.originY },
        alwaysVisible,
        sectionId: data.section,
      });
    },
    [alwaysVisible, onChange],
  );

  useEffect(() => {
    setEnabledPositionSetting(true);
  }, []);

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
            <ColorPicker format="hex" />
          </Form.Item>
          <Form.Item label="테두리 색상">
            <ColorPicker format="hex" />
          </Form.Item>
          <Form.Item label="테두리 두께">
            <Slider min={1} max={10} style={{ width: 80 }} />
          </Form.Item>
          <Form.Item label="아이콘 색상">
            <ColorPicker format="hex" />
          </Form.Item>
          <Form.Item label="말풍선 색상">
            <ColorPicker format="hex" />
          </Form.Item>
        </Flex>

        <Flex gap="middle">
          <Button
            onClick={() => {
              setOriginPosition(null);
              onChange({
                position: null,
                alwaysVisible,
                sectionId,
              });
            }}
          >
            초기화
          </Button>
        </Flex>
      </Flex>
      <Flex justify="center" style={{ overflow: 'auto' }}>
        <MapViewer
          mapId={mapId}
          width={900}
          facility={originPosition}
          facilityIconUrl={iconUrl}
          onClick={(data) => {
            if (enabledPositionSetting) {
              onClickMap(data);
            }
          }}
        />
      </Flex>
    </Flex>
  );
}
