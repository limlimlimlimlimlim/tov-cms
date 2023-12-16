'use client';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import AccountForm from '../../account-form';
import { getUserDetail } from '../../../../api/account';

export default function AccountEdit() {
  const { userId } = useParams();
  const [accountData, setAccountData] = useState();

  const fetchData = useCallback(async () => {
    const data = await getUserDetail(userId);
    setAccountData(data.data);
  }, [userId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return <AccountForm data={accountData} />;
}
