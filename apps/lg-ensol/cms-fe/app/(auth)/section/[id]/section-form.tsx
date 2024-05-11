'use client';

import { Flex, Layout, Typography } from 'antd';
import { useContext } from 'react';
import { SectionContext } from './section-context';
import SectionManagement from './section-management/section-management';

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
  const { mapData, status }: any = useContext(SectionContext);

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
      <Content style={contentStyle}>
        <SectionManagement mapData={mapData} status={status} />
      </Content>
    </Layout>
  );
}
