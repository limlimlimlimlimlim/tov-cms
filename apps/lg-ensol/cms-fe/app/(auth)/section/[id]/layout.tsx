'use client';

import { useState } from 'react';
import { Button, Flex } from 'antd';
import SectionForm from './section-form';
import { SectionProvider } from './section-context';
import FacilityContainer from './facility-container';

export default function SectionDetailLayout({ children }) {
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <SectionProvider>
      <Flex gap="small">
        <SectionForm>
          {children}
          <Button onClick={showDrawer}>시설 목록</Button>
        </SectionForm>

        <FacilityContainer open={open} onClose={onClose} />
      </Flex>
    </SectionProvider>
  );
}
