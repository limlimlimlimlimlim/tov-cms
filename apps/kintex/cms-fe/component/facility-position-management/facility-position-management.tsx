'use client';

import {
  Button,
  ColorPicker,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Slider,
  Switch,
  message,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { MapViewer } from '../map-viewer/map-viewer';
import { getMapDetail } from '../../api/map';

const { Option } = Select;
const fontSizeOptions = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];

const defaultStyle = {
  color: '#D2C60C',
  strokeColor: '#D2C60C',
  alpha: 30,
  strokeAlpha: 30,
  strokeWidth: 5,
  fontSize: 18,
  iconColor: '#D91700',
  tooltipColor: '#000000',
  padding: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
};

export default function FacilityPositionManagement({
  mapId,
  facility,
  mapSections,
  iconUrl,
  onChange,
  onChangeSection,
}) {
  const [enabledPositionSetting, setEnabledPositionSetting] = useState<any>();
  const [originPosition, setOriginPosition] = useState<any>({
    x: facility.x,
    y: facility.y,
  });
  const [alwaysVisible, setAlwaysVisible] = useState(false);
  const [fontSize, setFontSize] = useState<any>();
  const [iconColor, setIconColor] = useState<any>();
  const [tooltipColor, setTooltipColor] = useState<any>();
  const [padding, setPadding] = useState<any>(defaultStyle.padding);
  const [prevSection, setPrevSection] = useState<any>();
  const [currentSection, setCurrentSection] = useState<any>();
  const [currentSectionColor, setCurrentSectionColor] = useState<string>();
  const [currentSectionStrokeColor, setCurrentSectionStrokeColor] =
    useState<string>();
  const [currentSectionStrokeWidth, setCurrentSectionStrokeWidth] =
    useState<number>();
  const [sections, setSections] = useState<any>();
  const [originSections, setOriginSections] = useState<any>();
  const [currentOptions, setCurrentOptions] = useState<any>({});
  const [image, setImage] = useState();

  const updateSection = useCallback(
    (targetSection, options, setCurrent = true) => {
      if (!sections) return;
      if (!targetSection) {
        message.warning('구역을 선택해주세요.');
        return;
      }
      const isGroup = targetSection.group;
      const _sections = [...sections];
      if (isGroup) {
        targetSection.group.sections.forEach((target) => {
          const index = sections.findIndex((s) => s.id === target.id);
          _sections[index] = { ..._sections[index], ...options };
        });
      } else {
        const index = sections.findIndex((s) => s.id === targetSection.id);
        _sections[index] = { ..._sections[index], ...options };
      }
      setSections(_sections);
      if (setCurrent) {
        setCurrentSection(targetSection);
      }
      setCurrentOptions(options);
      onChange({
        position: originPosition,
        alwaysVisible,
        fontSize: options.fontSize,
        iconColor: options.iconColor,
        tooltipColor: options.tooltipColor,
        padding: options.padding,
        section: { ...targetSection, ...options },
      });
    },

    [alwaysVisible, onChange, originPosition, sections],
  );

  const onClickMap = useCallback(
    async (data) => {
      if (prevSection && prevSection.id !== data.section.id) {
        const result = await new Promise((res, rej) => {
          Modal.confirm({
            title: '구역 변경 안내',
            okText: '확인',
            cancelText: '취소',
            content:
              '구역을 변경하면 수정사항이 초기화됩니다. 계속 진행하시겠습니까?',
            onOk() {
              onChangeSection();
              res(true);
            },
            onCancel() {
              rej(false);
            },
          });
        });
        if (result) onChangeSection();
        else return;
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
        iconColor,
        tooltipColor,
        section: data.section,
        padding,
      });
    },
    [
      alwaysVisible,
      fontSize,
      iconColor,
      onChange,
      onChangeSection,
      padding,
      prevSection,
      tooltipColor,
    ],
  );

  useEffect(() => {
    setFontSize(facility.fontSize || defaultStyle.fontSize);
    setIconColor(facility.iconColor || defaultStyle.iconColor);
    setTooltipColor(facility.tooltipColor || defaultStyle.tooltipColor);
    setPadding(
      facility
        ? {
            top: facility.paddingTop,
            bottom: facility.paddingBottom,
            left: facility.paddingLeft,
            right: facility.paddingRight,
          }
        : { ...defaultStyle.padding },
    );
    if (facility.section) {
      setCurrentSection({ ...facility.section });
      setCurrentOptions({
        color: facility.section.color,
        alpha: facility.section.alpha,
        strokeWidth: facility.section.strokeWidth,
        strokeColor: facility.section.strokeColor,
        strokeAlpha: facility.section.strokeAlpha,
      });

      setCurrentSectionColor(
        addAlpha(facility.section.color, facility.section.alpha),
      );
      setCurrentSectionStrokeColor(
        addAlpha(facility.section.strokeColor, facility.section.strokeAlpha),
      );
      setCurrentSectionStrokeWidth(facility.section.strokeWidth);
    } else {
      setCurrentSectionColor(addAlpha(defaultStyle.color, defaultStyle.alpha));
      setCurrentSectionStrokeColor(
        addAlpha(defaultStyle.strokeColor, defaultStyle.strokeAlpha),
      );
      setCurrentSectionStrokeWidth(defaultStyle.strokeWidth);
    }
  }, [facility]);

  const addAlpha = (color: string, alpha: number) => {
    // coerce values so ti is between 0 and 1.
    const _alpha = Math.round(
      Math.min(Math.max(alpha * 0.01 || 1, 0), 1) * 255,
    );
    return color + _alpha.toString(16).toUpperCase();
  };

  const fetchData = useCallback(async (mapId) => {
    const result = await getMapDetail(mapId);
    // setSections(result.data.sections);
    setOriginSections(JSON.parse(JSON.stringify(result.data.sections)));
    setImage(result.data.image);
  }, []);

  useEffect(() => {
    setEnabledPositionSetting(true);
    if (mapId) {
      void fetchData(mapId);
    }
    setSections(mapSections);
  }, [facility, fetchData, mapId, mapSections]);

  const hasResource = useCallback(() => {
    return image && sections;
  }, [image, sections]);

  return (
    <Flex vertical gap="middle">
      <Flex justify="space-between">
        <Flex gap="small" vertical>
          <Flex gap="middle">
            <Form.Item label="위치 설정">
              <Switch
                checked={enabledPositionSetting}
                onChange={(checked) => {
                  setEnabledPositionSetting(checked);
                }}
              />
            </Form.Item>
            <Form.Item label="폰트 사이즈">
              <Select
                disabled={!currentSection}
                style={{ width: 80 }}
                value={fontSize}
                onChange={(value) => {
                  setFontSize(value);
                  updateSection(currentSection, {
                    color: currentOptions.color,
                    alpha: currentOptions.alpha,
                    strokeWidth: currentOptions.strokeWidth,
                    strokeColor: currentOptions.strokeColor,
                    strokeAlpha: currentOptions.strokeAlpha,
                    fontSize: value,
                    iconColor,
                    tooltipColor,
                    padding,
                  });
                }}
              >
                {fontSizeOptions.map((fontSize) => (
                  <Option key={fontSize} value={fontSize}>
                    {fontSize}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="영역 색상">
              {currentSectionColor && (
                <ColorPicker
                  disabled={!currentSection}
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
                      fontSize,
                      iconColor,
                      tooltipColor,
                      padding,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item label="테두리 색상">
              {currentSectionStrokeColor && (
                <ColorPicker
                  disabled={!currentSection}
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
                      fontSize,
                      iconColor,
                      tooltipColor,
                      padding,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item label="테두리 두께">
              <Slider
                disabled={!currentSection}
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
                    fontSize,
                    iconColor,
                    tooltipColor,
                    padding,
                  });
                }}
              />
            </Form.Item>

            <Form.Item label="아이콘 색상">
              {iconColor && (
                <ColorPicker
                  disabled={!currentSection}
                  format="hex"
                  value={iconColor}
                  disabledAlpha
                  onChangeComplete={(color: any) => {
                    const hex = color.toHexString();
                    setIconColor(hex);
                    updateSection(currentSection, {
                      color: currentOptions.color,
                      alpha: currentOptions.alpha,
                      strokeWidth: currentOptions.strokeWidth,
                      strokeColor: currentOptions.strokeColor,
                      strokeAlpha: currentOptions.strokeAlpha,
                      fontSize,
                      iconColor: hex,
                      tooltipColor,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item label="말풍선 색상">
              {tooltipColor && (
                <ColorPicker
                  disabled={!currentSection}
                  format="hex"
                  value={tooltipColor}
                  disabledAlpha
                  onChangeComplete={(color: any) => {
                    const hex = color.toHexString();
                    setTooltipColor(hex);
                    updateSection(currentSection, {
                      color: currentOptions.color,
                      alpha: currentOptions.alpha,
                      strokeWidth: currentOptions.strokeWidth,
                      strokeColor: currentOptions.strokeColor,
                      strokeAlpha: currentOptions.strokeAlpha,
                      fontSize,
                      iconColor,
                      tooltipColor: hex,
                    });
                  }}
                />
              )}
            </Form.Item>
          </Flex>
          <Flex gap="middle">
            <Form.Item label="Padding Top">
              <Input
                disabled={!currentSection}
                type="number"
                style={{ width: 80 }}
                value={padding.top}
                onChange={(e) => {
                  const padd = {
                    ...padding,
                    top: parseInt(e.currentTarget.value),
                  };
                  setPadding(padd);
                  updateSection(currentSection, {
                    color: currentOptions.color,
                    alpha: currentOptions.alpha,
                    strokeColor: currentOptions.strokeColor,
                    strokeAlpha: currentOptions.strokeAlpha,
                    strokeWidth: currentOptions.strokeWidth,
                    fontSize,
                    iconColor,
                    tooltipColor,
                    padding: padd,
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="Padding Bottom">
              <Input
                disabled={!currentSection}
                type="number"
                style={{ width: 80 }}
                value={padding.bottom}
                onChange={(e) => {
                  const padd = {
                    ...padding,
                    bottom: parseInt(e.currentTarget.value),
                  };
                  setPadding(padd);
                  updateSection(currentSection, {
                    color: currentOptions.color,
                    alpha: currentOptions.alpha,
                    strokeColor: currentOptions.strokeColor,
                    strokeAlpha: currentOptions.strokeAlpha,
                    strokeWidth: currentOptions.strokeWidth,
                    fontSize,
                    iconColor,
                    tooltipColor,
                    padding: padd,
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="Padding Left">
              <Input
                disabled={!currentSection}
                type="number"
                style={{ width: 80 }}
                value={padding.left}
                onChange={(e) => {
                  const padd = {
                    ...padding,
                    left: parseInt(e.currentTarget.value),
                  };
                  setPadding(padd);
                  updateSection(currentSection, {
                    color: currentOptions.color,
                    alpha: currentOptions.alpha,
                    strokeColor: currentOptions.strokeColor,
                    strokeAlpha: currentOptions.strokeAlpha,
                    strokeWidth: currentOptions.strokeWidth,
                    fontSize,
                    iconColor,
                    tooltipColor,
                    padding: padd,
                  });
                }}
              />
            </Form.Item>
            <Form.Item label="Padding Right">
              <Input
                disabled={!currentSection}
                type="number"
                style={{ width: 80 }}
                value={padding.right}
                onChange={(e) => {
                  const padd = {
                    ...padding,
                    right: parseInt(e.currentTarget.value),
                  };
                  setPadding(padd);
                  updateSection(currentSection, {
                    color: currentOptions.color,
                    alpha: currentOptions.alpha,
                    strokeColor: currentOptions.strokeColor,
                    strokeAlpha: currentOptions.strokeAlpha,
                    strokeWidth: currentOptions.strokeWidth,
                    fontSize,
                    iconColor,
                    tooltipColor,
                    padding: padd,
                  });
                }}
              />
            </Form.Item>
          </Flex>
        </Flex>

        <Flex gap="middle">
          <Button
            onClick={() => {
              setOriginPosition(null);
              setCurrentSection(null);
              onChange({
                position: { x: null, y: null },
                alwaysVisible,
                fontSize,
                iconColor,
                tooltipColor,
                section: null,
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
                { x: originPosition.x, y: originPosition.y, icon: iconUrl },
              ] as any
            }
            onClick={(data) => {
              if (enabledPositionSetting) {
                void onClickMap(data);
              }
            }}
          />
        )}
      </Flex>
    </Flex>
  );
}
