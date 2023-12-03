'use client';

import { Button, Flex, Form, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import MapViewer from '../map-viewer/map-viewer';

export default function FacilityPositionManagement({ mapId }) {
  const [enabledPositionSetting, setEnabledPositionSetting] = useState<any>();
  const [position, setPosition] = useState<any>();
  const [originPosition, setOriginPosition] = useState<any>();

  const onClickMap = (data) => {
    setPosition({ x: data.x, y: data.y });
    setOriginPosition({ x: data.originX, y: data.originY });
  };

  useEffect(() => {
    setEnabledPositionSetting(false);
    setPosition(null);
    setOriginPosition(null);
  }, []);

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="small">
          <Form.Item label="위치설정">
            <Switch
              checked={enabledPositionSetting}
              onChange={(checked) => {
                setEnabledPositionSetting(checked);
              }}
            />
          </Form.Item>
          <Form.Item label="상시표시">
            <Switch />
          </Form.Item>
        </Flex>

        <Flex gap="middle">
          <Button
            onClick={() => {
              setPosition(null);
              setOriginPosition(null);
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
          onClick={onClickMap}
        />
      </Flex>
    </Flex>
  );
}
