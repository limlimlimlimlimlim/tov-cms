'use client';

import SectionForm from './section-form';
import { SectionProvider } from './section-context';

export default function SectionEdit({ children }) {
  return (
    <SectionProvider>
      <SectionForm>{children}</SectionForm>
    </SectionProvider>
  );
}
