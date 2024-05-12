'use client';

import { useState } from 'react';
import Script from 'next/script';
import { Button, Flex } from 'antd';
import SectionForm from './section-form';
import { SectionProvider } from './section-context';
import FacilityContainer from './facility-container';

export default function SectionEdit({ children }) {
  const [open, setOpen] = useState(false);
  const [isScriptReady, setIsScriptReady] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <SectionProvider>
      <Script
        src="https://unpkg.com/konva@9/konva.min.js"
        onLoad={() => {
          setIsScriptReady(true);
        }}
      />
      {isScriptReady && (
        <Flex gap="small">
          <SectionForm>{children}</SectionForm>
          <Button size="small" onClick={showDrawer}>
            시설 목록
          </Button>
          <FacilityContainer open={open} onClose={onClose} />
        </Flex>
      )}
    </SectionProvider>
  );
}
