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
  }, [setData]);

  const onClickSearch = useCallback(() => {
    router.push('/search');
  }, [router]);

  return (
    <>
      <header className="header">
        <div>
          <button className="btn-back" onClick={router.back} />
          <h2>빌딩안내</h2>
          <button className="btn-home" />
          <button className="btn-menu" />
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
      {data ? <section className="content">{children}</section> : null}
    </>
  );
}
