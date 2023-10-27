'use client';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBuildingContext } from '../context/building';
import dummyData from '../../data/data';

export default function BuildingLayout({ children }: any) {
  const router = useRouter();
  const { data, setData }: any = useBuildingContext();

  useEffect(() => {
    setData(dummyData.tree as any);
  }, []);

  const onClickSearch = useCallback(() => {
    router.push('/search');
  }, []);

  return (
    <>
      <header className="header">
        <div>
          <button className="btn-back" onClick={router.back}></button>
          <h2>빌딩안내</h2>
          <button className="btn-home"></button>
          <button className="btn-menu"></button>
        </div>
      </header>

      <section className="form-search">
        <input
          type="button"
          className="ip-srchForm"
          value="초성만 입력해도 검색이 가능합니다."
          onClick={onClickSearch}
        />
      </section>
      {data && <section className="content">{children}</section>}
    </>
  );
}
