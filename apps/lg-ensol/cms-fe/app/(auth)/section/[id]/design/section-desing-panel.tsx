import {
  Card,
  ColorPicker,
  Flex,
  Form,
  InputNumber,
  Select,
  Slider,
  Tabs,
} from 'antd';
import { useCallback, useEffect, useState } from 'react';
import type Section from '../classes/section';
import { convertColorParam, hex2rgb } from '../utils/utils';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface Props {
  section: Section;
  onChangeSectionPaint: (section: Section) => void;
  onChangeFacility: (facility: any) => void;
}

const fontSizeOptions = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];

const SectionDesignPanel = ({
  section,
  onChangeSectionPaint,
  onChangeFacility,
}: Props) => {
  const [fill, setFill] = useState<string>();
  const [opacity, setOpacity] = useState<number>();
  const [stroke, setStroke] = useState<string>();
  const [strokeOpacity, setStrokeOpacity] = useState<number>();
  const [strokeWidth, setStrokeWidth] = useState<number>();
  const [facility, setFacility] = useState<any>();
  const [fontSize, setFontSize] = useState<number>(0);
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const [paddingBottom, setPaddingBottom] = useState<number>(0);
  const [paddingLeft, setPaddingLeft] = useState<number>(0);
  const [paddingRight, setPaddingRight] = useState<number>(0);
  const [iconColor, setIconColor] = useState('#000000');
  const [tooltipColor, setTooltipColor] = useState('#000000');

  const updateSectionFillColor = useCallback(
    ({ hex, alpha }) => {
      setFill(hex);
      setOpacity(alpha);
      onChangeSectionPaint(section);
      section.updateOption({
        fill: hex,
        opacity: alpha,
      });
    },
    [onChangeSectionPaint, section],
  );

  const updateSectionStrokeColor = useCallback(
    ({ hex, alpha }) => {
      setStroke(hex);
      setStrokeOpacity(alpha);
      onChangeSectionPaint(section);
      section.updateOption({
        stroke: hex,
        strokeOpacity: alpha,
      });
    },
    [onChangeSectionPaint, section],
  );

  const updateSectionStrokeWidth = useCallback(
    (value) => {
      setStrokeWidth(value);
      onChangeSectionPaint(section);
      section.updateOption({
        strokeWidth: value,
      });
    },
    [onChangeSectionPaint, section],
  );

  useEffect(() => {
    if (!section?.options) return;
    setFill(section.options.fill);
    setOpacity(section.options.opacity);
    setStroke(section.options.stroke);
    setStrokeOpacity(section.options.strokeOpacity);
    setStrokeWidth(section.options.strokeWidth);
    setFacility(section.facility);
    if (section.facility) {
      const {
        fontSize,
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        iconColor,
        tooltipColor,
      } = section.facility;
      setFontSize(fontSize);
      setPaddingTop(paddingTop);
      setPaddingBottom(paddingBottom);
      setPaddingLeft(paddingLeft);
      setPaddingRight(paddingRight);
      setIconColor(iconColor);
      setTooltipColor(tooltipColor);
    }
  }, [section]);
  return (
    <div style={{ position: 'absolute', right: 24, top: 60, zIndex: 1000 }}>
      <Card style={{ width: 350 }}>
        <Tabs
          defaultActiveKey="1"
          type="card"
          size="small"
          items={[
            {
              label: '영역',
              key: 'area',
              children: (
                <div>
                  <Form.Item label="채우기 색상">
                    <ColorPicker
                      format="hex"
                      value={hex2rgb(fill, opacity)}
                      onChangeComplete={(color: any) => {
                        updateSectionFillColor(
                          convertColorParam(color.metaColor),
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="테두리 색상">
                    <ColorPicker
                      format="hex"
                      value={hex2rgb(stroke, strokeOpacity)}
                      onChangeComplete={(color: any) => {
                        updateSectionStrokeColor(
                          convertColorParam(color.metaColor),
                        );
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="테두리 두께">
                    <Slider
                      value={strokeWidth}
                      min={1}
                      max={30}
                      onChange={(value) => {
                        updateSectionStrokeWidth(value);
                      }}
                    />
                  </Form.Item>
                </div>
              ),
            },
            {
              label: '텍스트',
              key: 'text',
              disabled: !facility,
              children: (
                <div>
                  <Form.Item label="폰트 사이즈">
                    <Select
                      size="small"
                      value={fontSize}
                      onChange={(value) => {
                        if (!facility) return;
                        setFontSize(value);
                        section.updateFacilityOption({ fontSize: value });
                        onChangeFacility(section.facility);
                      }}
                    >
                      {fontSizeOptions.map((fontSize) => (
                        <Select.Option key={fontSize} value={fontSize}>
                          {fontSize}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="간격">
                    <Flex gap={10}>
                      <div>
                        TOP{' '}
                        <InputNumber
                          size="small"
                          style={{ width: 70 }}
                          value={paddingTop}
                          min={0}
                          onChange={(value) => {
                            if (!facility) return;
                            if (paddingTop === undefined) return;
                            if (!value) return;
                            setPaddingTop(value);
                            section.updateFacilityOption({ paddingTop: value });
                            onChangeFacility(section.facility);
                          }}
                        />
                      </div>
                      <div>
                        Bottom
                        <InputNumber
                          size="small"
                          style={{ width: 70 }}
                          value={paddingBottom}
                          min={0}
                          onChange={(value) => {
                            if (!facility) return;
                            if (paddingBottom === undefined) return;
                            if (!value) return;
                            setPaddingBottom(value);
                            section.updateFacilityOption({
                              paddingBottom: value,
                            });
                            onChangeFacility(section.facility);
                          }}
                        />
                      </div>
                      <div>
                        Left
                        <InputNumber
                          size="small"
                          style={{ width: 70 }}
                          value={paddingLeft}
                          min={0}
                          onChange={(value) => {
                            if (!facility) return;
                            if (paddingLeft === undefined) return;
                            if (!value) return;
                            setPaddingLeft(value);
                            section.updateFacilityOption({
                              paddingLeft: value,
                            });
                            onChangeFacility(section.facility);
                          }}
                        />
                      </div>
                      <div>
                        Right
                        <InputNumber
                          size="small"
                          style={{ width: 70 }}
                          value={paddingRight}
                          min={0}
                          onChange={(value) => {
                            if (!facility) return;
                            if (paddingRight === undefined) return;
                            if (!value) return;
                            setPaddingRight(value);
                            section.updateFacilityOption({
                              paddingRight: value,
                            });
                            onChangeFacility(section.facility);
                          }}
                        />
                      </div>
                    </Flex>
                  </Form.Item>
                </div>
              ),
            },
            {
              label: '아이콘',
              key: 'icon',
              disabled: !facility,
              children: (
                <div>
                  <Form.Item label="아이콘 색상">
                    <ColorPicker
                      format="hex"
                      // onChangeComplete={(color: any) => {
                      //   const hex = color.toHexString();
                      //   const alpha = color.metaColor.roundA * 100;
                      //   setCurrentSectionColor(hex);
                      //   updateSection(currentSection, {
                      //     color: hex.substr(0, 7),
                      //     alpha,
                      //     strokeColor: currentOptions.strokeColor,
                      //     strokeAlpha: currentOptions.strokeAlpha,
                      //     strokeWidth: currentOptions.strokeWidth,
                      //     fontSize,
                      //     iconColor,
                      //     tooltipColor,
                      //     padding,
                      //   });
                      // }}
                    />
                  </Form.Item>
                </div>
              ),
            },
            {
              label: '말풍선',
              key: 'tooltip',
              disabled: !facility,
              children: (
                <div>
                  <Form.Item label="말풍선 색상">
                    <ColorPicker
                      format="hex"
                      // onChangeComplete={(color: any) => {
                      //   const hex = color.toHexString();
                      //   const alpha = color.metaColor.roundA * 100;
                      //   setCurrentSectionColor(hex);
                      //   updateSection(currentSection, {
                      //     color: hex.substr(0, 7),
                      //     alpha,
                      //     strokeColor: currentOptions.strokeColor,
                      //     strokeAlpha: currentOptions.strokeAlpha,
                      //     strokeWidth: currentOptions.strokeWidth,
                      //     fontSize,
                      //     iconColor,
                      //     tooltipColor,
                      //     padding,
                      //   });
                      // }}
                    />
                  </Form.Item>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default SectionDesignPanel;
