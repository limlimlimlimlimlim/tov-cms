'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import usePermission from '../../hooks/usePermission';
import MapForm from '../map-form';

export default function MapRegister() {
  const { ready, getMapPermissions }: any = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const result = getMapPermissions();
    if (!result.write) {
      router.replace('/error/403');
    }
  }, [getMapPermissions, ready, router]);

  return <MapForm data={null} />;
}
