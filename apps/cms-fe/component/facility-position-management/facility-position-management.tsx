'use client';

import { Button, Flex, Form, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import MapViewer from '../map-viewer/map-viewer';

export default function FacilityPositionManagement({ mapId, onChange }) {
  const [enabledPositionSetting, setEnabledPositionSetting] = useState<any>();
  const [originPosition, setOriginPosition] = useState<any>();
  const [alwaysVisible, setAlwaysVisible] = useState(false);
  const onClickMap = useCallback(
    (data) => {
      setOriginPosition({ x: data.originX, y: data.originY });
      onChange({
        position: { x: data.originX, y: data.originY },
        alwaysVisible,
      });
    },
    [alwaysVisible, onChange],
  );

  useEffect(() => {
    setEnabledPositionSetting(true);
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
            <Switch
              checked={alwaysVisible}
              onChange={(check) => {
                setAlwaysVisible(check);
                onChange({
                  position: originPosition,
                  alwaysVisible: check,
                });
              }}
            />
          </Form.Item>
        </Flex>

        <Flex gap="middle">
          <Button
            onClick={() => {
              setOriginPosition(null);
              onChange({
                position: null,
                alwaysVisible,
              });
            }}
          >
            초기화
          </Button>
        </Flex>
      </Flex>
      <Flex justify="center" style={{ overflow: 'auto' }}>
        {enabledPositionSetting}
        <MapViewer
          mapId={mapId}
          width={900}
          facility={originPosition}
          onClick={enabledPositionSetting ? onClickMap : null}
        />
      </Flex>
    </Flex>
  );
}
