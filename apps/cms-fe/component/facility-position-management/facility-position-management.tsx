'use client';

import { Button, Flex, Form, Switch } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import MapViewer from '../map-viewer/map-viewer';

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
                  sectionId,
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
                sectionId,
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
          facilityIconUrl={iconUrl}
          onClick={enabledPositionSetting ? onClickMap : null}
        />
      </Flex>
    </Flex>
  );
}
