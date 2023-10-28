'use client';
import { useCallback, useEffect, useState } from 'react';
import dummyData from '../../data/data';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Main() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isShowPopup, setIsShowPopup] = useState(false);

  useEffect(() => {
    setData(dummyData.tree as any);
  }, []);

  const createItems = useCallback(() => {
    return data.map((item: any, i) => {
      return (
        <li key={i}>
          <Link href={`/building/${item.id}/${item.wing[0].id}`}>
            <p>
              {item.floorName}
              <i className="ic_arrow_right"></i>
            </p>
          </Link>
        </li>
      );
    });
  }, [data]);

  const onClickSearch = useCallback(() => {
    router.push('/search');
  }, []);

  const onClickShowPopup = useCallback(() => {
    setIsShowPopup(true);
  }, []);

  const onClickHidePopup = useCallback(() => {
    setIsShowPopup(false);
  }, []);

  return (
    <>
      <header className="header">
        <div>
          <button className="btn-back"></button>
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

      <section className="content">
        <div className="list-floor">
          <ul>{createItems()}</ul>
        </div>

        <button
          className="btn-popup twinIntro"
          data-target=".pop-twinIntro"
          onClick={onClickShowPopup}
        >
          LG 트윈타워 소개
        </button>

        <div className="info-box">
          <div>
            <span className="ic_barrier"></span>
          </div>
          <div className="text-box">
            <b>장애인 화장실 위치 안내</b>
            <p>동관 지하 1층, 서관 지하 1층에 위치해 있습니다.</p>
          </div>
        </div>
      </section>

      {/* <!-- popup 트윈타워 소개 --> */}
      <section
        className={`popup-wrap pop-twinIntro ${isShowPopup ? 'on' : ''}`}
      >
        <div className="popup-layer">
          <h3>LG 트윈타워 소개</h3>
          {/* <!-- <button className="btn-close"></button> --> */}
          <div className="pop-cont">
            <div>
              <img src="/images/img-popupContent.jpg" alt="" />
            </div>
          </div>
          <button className="btn-ok" onClick={onClickHidePopup}>
            확인
          </button>
        </div>
      </section>
    </>
  );
}
