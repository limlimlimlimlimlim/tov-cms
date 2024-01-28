'use client';

import { Button, Flex } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { MapViewer } from '../map-viewer/map-viewer';
import { getMapDetail } from '../../api/map';

export default function KioskPositionManagement({
  mapId,
  kiosk,
  mapSections,
  onChange,
}) {
  const [originPosition, setOriginPosition] = useState<any>({
    x: kiosk?.x || -1,
    y: kiosk?.y || -1,
  });
  const [sections, setSections] = useState<any>();
  const [image, setImage] = useState();

  const fetchData = useCallback(async (mapId) => {
    const result = await getMapDetail(mapId);
    setSections(result.data.sections);
    setImage(result.data.image);
  }, []);

  useEffect(() => {
    if (mapId) {
      void fetchData(mapId);
    }
    setSections(mapSections);
  }, [fetchData, mapId, mapSections]);

  const hasResource = useCallback(() => {
    return image && sections;
  }, [image, sections]);

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="middle">
          <Button
            onClick={() => {
              setOriginPosition(null);
              onChange({
                position: { x: null, y: null },
              });
            }}
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
            markers={
              [
                {
                  x: originPosition.x,
                  y: originPosition.y,
                  icon: '/pin02.png',
                },
              ] as any
            }
            onClickMap={(data) => {
              setOriginPosition({
                ...originPosition,
                x: data.originX,
                y: data.originY,
              });

              onChange({
                position: { x: data.originX, y: data.originY },
              });
            }}
            onClickSection={null}
          />
        )}
      </Flex>
    </Flex>
  );
}
