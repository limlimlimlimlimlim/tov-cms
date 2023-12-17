'use client';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AccountForm from '../../account-form';
import { getUserDetail } from '../../../../../api/account';
import usePermission from '../../../hooks/usePermission';

export default function AccountEdit() {
  const { userId } = useParams();
  const [accountData, setAccountData] = useState();
  const { ready, getAccountPermissions }: any = usePermission();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const data = await getUserDetail(userId);
    setAccountData(data.data);
  }, [userId]);

  useEffect(() => {
    if (!ready) return;
    const result = getAccountPermissions();
    if (!result.update) {
      router.replace('/error/403');
    }
    void fetchData();
  }, [fetchData, getAccountPermissions, ready, router]);

  return <AccountForm data={accountData} />;
}
