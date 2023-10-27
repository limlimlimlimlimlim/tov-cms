'use client';

import { useCallback, useEffect, useState } from 'react';
import dummyData from '../../data/data';
import { useRouter } from 'next/navigation';

export default function Search() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [searchItem, setSearchItem] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setData(dummyData.facility as any);
  }, []);

  const onChangeKeyword = useCallback((e: any) => {
    setKeyword(e.target.value);
  }, []);

  const onClickItem = useCallback((item: any) => {
    router.replace(`building/${item.floorId}/${item.buildingId}/${item.id}`);
  }, []);

  useEffect(() => {
    if (keyword.trim() === '') {
      setSearchItem([]);
      return;
    }

    const includeTag = (values: string[], target: string) => {
      return values.some((value) => {
        return value.trim().indexOf(target) === 0;
      });
    };

    const filtered = data.filter((item: any) => {
      return (
        (item.name as string).indexOf(keyword) === 0 ||
        includeTag((item.initial as string).split(','), keyword)
      );
    });

    setSearchItem(
      filtered.map((item: any, index) => {
        return (
          <li key={index}>
            <div className="text-box">
              <span className="tag">{item.floor}</span>
              <span className="area">{item.building}</span>
              <p>{item.name}</p>
              <i>{item.phone}</i>
            </div>
            <div className="link-box">
              <button
                type="button"
                onClick={() => {
                  onClickItem(item);
                }}
              >
                <span></span>위치안내
              </button>
            </div>
          </li>
        );
      }) as any,
    );
  }, [data, keyword]);
  return (
    <>
      <header className="header">
        <div>
          <button
            className="btn-back"
            onClick={() => {
              router.back();
            }}
          ></button>
          <h2>검색</h2>
          <button className="btn-home"></button>
          <button className="btn-menu"></button>
        </div>
      </header>

      <section className="form-search">
        <input
          type="search"
          placeholder="초성만 입력해도 검색이 가능합니다."
          onChange={onChangeKeyword}
        />
        <button type="button" className="btn-search"></button>
        <span className="btn-delete"></span>
      </section>

      <section className="content">
        <div className="list-search">
          {searchItem.length === 0 && (
            <div className="noSearch">
              <img src="/images/ic_character_gray.svg" alt="" />
              <p>찾으실 내용을 입력해주세요.</p>
            </div>
          )}

          {keyword.length > 0 && searchItem.length > 0 && <ul>{searchItem}</ul>}
        </div>
      </section>
    </>
  );
}
