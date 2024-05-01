'use client';

import { Button, Divider, Flex, Layout, Typography } from 'antd';
import Link from 'next/link';
import MapSectionMerger from '../../../../component/map-area-editor/map-section-merger';
import { useContext } from 'react';
import { SectionContext } from './section-context';

const { Header, Content } = Layout;
const { Title } = Typography;

const headerStyle: React.CSSProperties = {
  height: 64,
  padding: 0,
  lineHeight: '64px',
  backgroundColor: '#fff',
};

const contentStyle: React.CSSProperties = {
  minHeight: 120,
  height: '100%',
  lineHeight: '120px',
  backgroundColor: '#fff',
};

const layoutStyle = {
  overflow: 'hidden',
  width: '100%',
  height: '100%',
};

export default function SectionForm({ children }) {
  const { mapData }: any = useContext(SectionContext);
  console.log(mapData);
  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Flex gap="small" justify="space-between">
          {mapData && (
            <>
              <Title level={5}>
                {mapData.wing.name} {mapData.floor.name}
              </Title>
              <Flex gap="small">{children}</Flex>
            </>
          )}
        </Flex>
      </Header>
      <Content style={contentStyle}>content</Content>
    </Layout>
  );
}
