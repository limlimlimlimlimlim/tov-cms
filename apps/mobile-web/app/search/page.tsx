export default function Search() {
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
        <input type="search" placeholder="초성만 입력해도 검색이 가능합니다." />
        <button type="button" className="btn-search"></button>
        <span className="btn-delete"></span>
      </section>

      {/* <!-- 메인 내용 --> */}
      <section className="content">
        <div className="list-search">
          {/* <!-- 검색 내용 입력 전 --> */}
          {/* <div className="noSearch">
            <img src="/images/ic_character_gray.svg" alt="" />
            <p>찾으실 내용을 입력해주세요.</p>
          </div> */}

          {/* <!-- 검색 내용 입력 후 --> */}
          <ul>
            <li>
              <div className="text-box">
                <span className="tag">5F</span>
                <span className="area">서관</span>
                <p>LG사랑 사내 어린이집</p>
                <i>02-0000-0000</i>
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
            <li>
              <div className="text-box">
                <span className="tag">2F</span>
                <span className="area">서관</span>
                <p>사내 약국</p>
                <i>02-0000-0000</i>
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
            <li>
              <div className="text-box">
                <span className="tag">5F</span>
                <span className="area">동관</span>
                <p>사내 병원</p>
                <i>02-0000-0000</i>
              </div>
              <div className="link-box">
                <button
                  type="button"
                  // onclick=""
                >
                  <span></span>위치안내
                </button>
              </div>
            </li>
            <li>
              <div className="text-box">
                <span className="tag">5F</span>
                <span className="area">중앙</span>
                <p>사내 약국</p>
                <i>02-0000-0000</i>
              </div>
              <div className="link-box">
                <button
                  type="button"
                  // onclick=""
                >
                  <span></span>위치안내
                </button>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
