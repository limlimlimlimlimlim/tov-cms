export default function Building() {
  return (
    <>
      {/* <!-- header --> */}
      <header className="header">
        <div>
          <button className="btn-back"></button>
          <h2>빌딩안내</h2>
          <button className="btn-home"></button>
          <button className="btn-menu"></button>
        </div>
      </header>

      {/* <!-- 검색 폼 - 검색 페이지로 이동 버튼 --> */}
      <section className="form-search">
        <input
          type="button"
          className="ip-srchForm"
          value="초성만 입력해도 검색이 가능합니다."
        />
      </section>

      {/* <!-- 메인 내용 --> */}
      <section className="content">
        <div className="floor-menu">
          <ul>
            <li>5F</li>
            <li>3F</li>
            <li>2F</li>
            <li className="active">1F</li>
            <li>B1</li>
            <li>B2</li>
            <li>B3</li>
          </ul>
        </div>
        <div className="area-menu">
          <table>
            <tbody>
              <tr>
                <td className="on" data-target=".tab-all">
                  전체
                </td>
                <td data-target=".tab-west">서관</td>
                <td data-target=".tab-center">중원</td>
                <td data-target=".tab-east">동관</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="tab-wrap">
          <div className="map-box detail">
            {/* <!-- <button type="button" className="btn-location ic_location_c"></button> --> */}
            <div className="map-area">
              <img src="/images/img-map-full.jpg" alt="지도" />
            </div>

            <div className="aside miniMap">
              <button type="button" className="btn-aside">
                미니맵
              </button>
              <button type="button" className="btn-close"></button>
              <img src="/images/img-miniMap.jpg" alt="" />
            </div>
            <div className="aside legend">
              <button type="button" className="btn-aside">
                범 례
              </button>
              <button type="button" className="btn-close"></button>
              <ul>
                <li>
                  <img src="/images/ic_legend-f.png" alt="" />
                  여자화장실
                </li>
                <li>
                  <img src="/images/ic_legend-m.png" alt="" />
                  남자화장실
                </li>
                <li>
                  <img src="/images/ic_legend-stair.png" alt="" />
                  계단
                </li>
                <li>
                  <img src="/images/ic_legend-ev.png" alt="" />
                  엘리베이터
                </li>
              </ul>
            </div>
          </div>
          <div className="aside-infowrap">
            <h3>사내병원 </h3>
            <button type="button" className="btn-close"></button>
            <div className="cont">
              <div className="profile-box">
                <img src="/images/ic_character_gray.svg" alt="" />
              </div>
              <div className="text-box">
                <ul>
                  <li>
                    <a href="tel:02-0000-0000">
                      <i className="ic_phone"></i>
                      <p>02-0000-0000</p>
                    </a>
                  </li>
                  <li>
                    <i className="ic_location"></i>
                    <p>서관 2F 123호</p>
                  </li>
                  <li>
                    <i className="ic_note"></i>
                    <p>
                      사내 임직원을 위해 운영중인 사내 약국입니다.
                      <br />
                      운영시간 : 9:00 ~ 17:00
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
