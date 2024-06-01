'use client';

import { Flex } from 'antd';
import SectionForm from './section-form';
import { SectionProvider } from './section-context';
import FacilityContainer from './components/facility-container/facility-container';
import FacilityModal from './components/facility-modal/facility-modal';

export default function SectionDetailLayout({ children }) {
  return (
    <SectionProvider>
      <Flex gap="small">
        <SectionForm>{children}</SectionForm>
        <FacilityContainer />
        <FacilityModal />
      </Flex>
    </SectionProvider>
  );
}
