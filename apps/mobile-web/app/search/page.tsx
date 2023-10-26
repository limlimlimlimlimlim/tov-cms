'use client';

import { useCallback, useEffect, useState } from 'react';
import dummyData from '../../data/data';

export default function Search() {
  const [data, setData] = useState([]);
  const [searchItem, setSearchItem] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setData(dummyData.facility as any);
  }, []);

  const onChangeKeyword = useCallback((e: any) => {
    setKeyword(e.target.value);
  }, []);

  useEffect(() => {
    if (keyword.trim() === '') {
      setSearchItem([]);
      return;
    }

    const includeTag = (values: string[], keyword: string) => {
      return values.some((value) => {
        return value.trim().indexOf(keyword) === 0;
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
                //   onclick="location.href='BD-detailView.html'"
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
      {/* <!-- header --> */}
      <header className="header">
        <div>
          <button
            className="btn-back"
            //   onclick="history.back();"
          ></button>
          <h2>검색</h2>
          <button className="btn-home"></button>
          <button className="btn-menu"></button>
        </div>
      </header>

      {/* <!-- 검색 폼 --> */}
      <section className="form-search">
        <input
          type="search"
          placeholder="초성만 입력해도 검색이 가능합니다."
          onChange={onChangeKeyword}
        />
        <button type="button" className="btn-search"></button>
        <span className="btn-delete"></span>
      </section>

      {/* <!-- 메인 내용 --> */}
      <section className="content">
        <div className="list-search">
          {searchItem.length === 0 && (
            <div className="noSearch">
              <img src="/images/ic_character_gray.svg" alt="" />
              <p>찾으실 내용을 입력해주세요.</p>
            </div>
          )}

          {/* <!-- 검색 내용 입력 후 --> */}
          {keyword.length > 0 && searchItem.length > 0 && <ul>{searchItem}</ul>}
        </div>
      </section>
    </>
  );
}
