'use client';

import { Button, Flex, Layout, Typography } from 'antd';
import { useCallback, useContext } from 'react';
import { SectionContext } from './section-context';
import SectionManagement from './components/section-management/section-management';

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
  const { mapData, hoverFacility, openFacilityContainer }: any =
    useContext(SectionContext);

  const onClickFacility = useCallback(() => {
    openFacilityContainer();
  }, [openFacilityContainer]);

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Flex gap="small" justify="space-between">
          {mapData && (
            <>
              <Title level={5}>
                {mapData.wing.name} {mapData.floor.name}
              </Title>
              <Flex gap="small">
                {children}
                <Button onClick={onClickFacility}>시설 목록</Button>
              </Flex>
            </>
          )}
        </Flex>
      </Header>
      <Content style={contentStyle}>
        {hoverFacility && (
          <div
            style={{
              position: 'absolute',
              minWidth: 200,
              left: '40%',
              top: 110,
              zIndex: 100000,
              height: 30,
              textAlign: 'center',
              lineHeight: 0.6,
              padding: 10,
              borderRadius: 20,
              color: '#fff',
              background: 'rgba(10,10,10,0.5)',
            }}
          >
            {hoverFacility?.name}
          </div>
        )}

        <SectionManagement mapData={mapData} />
      </Content>
    </Layout>
  );
}
