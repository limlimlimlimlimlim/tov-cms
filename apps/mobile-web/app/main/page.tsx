import Image from "next/image";

export default function Main() {
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
          //   onclick="location.href='./BD-search.html'"
        />
      </section>

      {/* <!-- 메인 내용 --> */}
      <section className="content">
        <div className="list-floor">
          <ul>
            <li>
              <a href="BD-list.html">
                <p>
                  5F<i className="ic_arrow_right"></i>
                </p>
              </a>
            </li>
            <li>
              <a href="BD-list.html">
                <p>
                  3F<i className="ic_arrow_right"></i>
                </p>
              </a>
            </li>
            <li>
              <a href="BD-list.html">
                <p>
                  2F<i className="ic_arrow_right"></i>
                </p>
              </a>
            </li>
            <li>
              <a href="BD-list.html">
                <p>
                  1F<i className="ic_arrow_right"></i>
                </p>
              </a>
            </li>
            <li>
              <a href="BD-list.html">
                <p>
                  B1<i className="ic_arrow_right"></i>
                </p>
              </a>
            </li>
            <li>
              <a href="BD-list.html">
                <p>
                  B2<i className="ic_arrow_right"></i>
                </p>
              </a>
            </li>
            <li>
              <a href="BD-list.html">
                <p>
                  B3<i className="ic_arrow_right"></i>
                </p>
              </a>
            </li>
          </ul>
        </div>

        <button className="btn-popup twinIntro" data-target=".pop-twinIntro">
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
      <section className="popup-wrap pop-twinIntro">
        <div className="popup-layer">
          <h3>LG 트윈타워 소개</h3>
          {/* <!-- <button className="btn-close"></button> --> */}
          <div className="pop-cont">
            <div>
              <img src="/images/img-popupContent.jpg" alt="" />
            </div>
          </div>
          <button className="btn-ok">확인</button>
        </div>
      </section>
    </>
  );
}
