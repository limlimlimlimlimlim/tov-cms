'use client';

import { Flex } from 'antd';
import SectionForm from './section-form';
import { SectionProvider } from './section-context';
import FacilityContainer from './facility-container';

export default function SectionDetailLayout({ children }) {
  return (
    <SectionProvider>
      <Flex gap="small">
        <SectionForm>{children}</SectionForm>
        <FacilityContainer />
      </Flex>
    </SectionProvider>
  );
}
