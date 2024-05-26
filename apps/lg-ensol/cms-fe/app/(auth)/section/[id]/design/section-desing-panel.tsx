import {
  Card,
  ColorPicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
  Tabs,
} from 'antd';
import type Section from '../classes/section';
import FormItem from 'antd/es/form/FormItem';

interface Props {
  section: Section;
}

const fontSizeOptions = [
  7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
];

const SectionDesignPanel = ({ section }: Props) => {
  console.log(section);
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
                      value={section.options?.fill}
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
                  <Form.Item label="테두리 색상">
                    <ColorPicker
                      format="hex"
                      value={section.options?.stroke}
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
              label: '텍스트',
              key: 'text',
              children: (
                <div>
                  <Form.Item label="폰트 사이즈">
                    <Select size="small">
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
                        TOP <InputNumber size="small" style={{ width: 70 }} />
                      </div>
                      <div>
                        Bottom
                        <InputNumber size="small" style={{ width: 70 }} />
                      </div>
                      <div>
                        Left
                        <InputNumber size="small" style={{ width: 70 }} />
                      </div>
                      <div>
                        Right
                        <InputNumber size="small" style={{ width: 70 }} />
                      </div>
                    </Flex>
                  </Form.Item>
                </div>
              ),
            },
            {
              label: '아이콘',
              key: 'icon',
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
