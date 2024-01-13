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
  const [prevSection, setPrevSection] = useState<any>();
  const [currentSection, setCurrentSection] = useState<any>();
  const [currentSectionColor, setCurrentSectionColor] = useState<string>();
  const [currentSectionStrokeColor, setCurrentSectionStrokeColor] =
    useState<string>();
  const [currentSectionStrokeWidth, setCurrentSectionStrokeWidth] =
    useState<number>();
  const [sections, setSections] = useState<any>();
  const [originSections, setOriginSections] = useState<any>();
  const [currentOptions, setCurrentOptions] = useState<any>();
  const [image, setImage] = useState();

  const updateSection = useCallback(
    (targetSection, options, setCurrent = true) => {
      if (!sections) return;
      const isGroup = targetSection.group;
      const _sections = [...sections];
      console.log(options);
      if (isGroup) {
        console.log('-----group----');
        console.log(targetSection.group.sections);
        targetSection.group.sections.forEach((target) => {
          const index = sections.findIndex((s) => s.id === target.id);
          _sections[index] = { ..._sections[index], ...options };
        });
        console.log('-----------');
      } else {
        const index = sections.findIndex((s) => s.id === targetSection.id);
        _sections[index] = { ..._sections[index], ...options };
      }
      setSections(_sections);
      if (setCurrent) {
        setCurrentSection(targetSection);
      }
      setCurrentOptions(options);
    },
    [sections],
  );

  const reset = useCallback(() => {
    console.log('::::::reset:::::');
    updateSection(
      prevSection,
      {
        color: prevSection.color,
        alpha: prevSection.alpha,
        strokeWidth: prevSection.strokeWidth,
        strokeColor: prevSection.strokeColor,
        strokeAlpha: prevSection.strokeAlpha,
      },
      false,
    );
  }, [prevSection, updateSection]);

  const onClickMap = useCallback(
    (data) => {
      console.log(prevSection, data.section);
      if (
        prevSection &&
        prevSection.id !== data.section.id &&
        prevSection.groupId !== data.section.groupId
      ) {
        reset();
      }
      setOriginPosition({ x: data.originX, y: data.originY });
      setCurrentSection(data.section);
      setCurrentOptions({
        color: data.section.color,
        alpha: data.section.alpha,
        strokeWidth: data.section.strokeWidth,
        strokeColor: data.section.strokeColor,
        strokeAlpha: data.section.strokeAlpha,
      });
      setPrevSection(JSON.parse(JSON.stringify(data.section)));
      onChange({
        position: { x: data.originX, y: data.originY },
        alwaysVisible,
        fontSize,
        section: data.section,
      });
    },
    [alwaysVisible, fontSize, onChange, prevSection, reset],
  );

  useEffect(() => {
    setFontSize(facility.fontSize || 12);
    setIconColor(facility.iconColor || '#ff9900');
    setTooltipColor(facility.tooltipColor || '#000000');
    setCurrentSection(facility.section || null);
    setCurrentOptions({
      color: facility.section.color,
      alpha: facility.section.alpha,
      strokeWidth: facility.section.strokeWidth,
      strokeColor: facility.section.strokeColor,
      strokeAlpha: facility.section.strokeAlpha,
    });
    setPrevSection(JSON.parse(JSON.stringify(facility.section || null)));
  }, [
    facility.fontSize,
    facility.iconColor,
    facility.section,
    facility.tooltipColor,
  ]);

  useEffect(() => {
    if (!currentSection) return;
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
    setOriginSections(JSON.parse(JSON.stringify(result.data.sections)));
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
            <ColorPicker
              format="hex"
              value={currentSectionColor}
              onChangeComplete={(color: any) => {
                const hex = color.toHexString();
                const alpha = color.metaColor.roundA * 100;
                setCurrentSectionColor(hex);
                updateSection(currentSection, {
                  color: hex.substr(0, 7),
                  alpha,
                  strokeColor: currentOptions.strokeColor,
                  strokeAlpha: currentOptions.strokeAlpha,
                  strokeWidth: currentOptions.strokeWidth,
                });
              }}
            />
          </Form.Item>
          <Form.Item label="테두리 색상">
            <ColorPicker
              format="hex"
              value={currentSectionStrokeColor}
              onChangeComplete={(color: any) => {
                const hex = color.toHexString();
                const strokeAlpha = color.metaColor.roundA * 100;
                setCurrentSectionStrokeColor(hex);
                updateSection(currentSection, {
                  color: currentOptions.color,
                  alpha: currentOptions.alpha,
                  strokeWidth: currentOptions.strokeWidth,
                  strokeColor: hex.substr(0, 7),
                  strokeAlpha,
                });
              }}
            />
          </Form.Item>
          <Form.Item label="테두리 두께">
            <Slider
              min={1}
              max={10}
              style={{ width: 80 }}
              value={currentSectionStrokeWidth}
              onChange={(value) => {
                setCurrentSectionStrokeWidth(value);
                updateSection(currentSection, {
                  strokeWidth: value,
                  color: currentOptions.color,
                  alpha: currentOptions.alpha,
                  strokeColor: currentOptions.strokeColor,
                  strokeAlpha: currentOptions.strokeAlpha,
                });
              }}
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
