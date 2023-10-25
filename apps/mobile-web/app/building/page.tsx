export default function Buildings() {
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
        />
      </section>

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
              <tr key="1">
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
          <div className="tab tab-all view">
            <div className="map-box list">
              <img src="../images/img-map-all.png" alt="지도" />
            </div>
            <div className="list-store">
              <h3>1F 전체</h3>
              <ul>
                <li>
                  <b>사내병원</b>
                  <div>
                    <a href="tel:000-0000" className="ic_phone"></a>
                    <a href="BD-detailView.html" className="ic_location"></a>
                  </div>
                </li>
                <li>
                  <b>사내약국</b>
                  <div>
                    <a href="tel:000-0000" className="ic_phone"></a>
                    <a href="BD-detailView.html" className="ic_location"></a>
                  </div>
                </li>
                <li>
                  <b>사내은행</b>
                  <div>
                    <a href="tel:000-0000" className="ic_phone"></a>
                    <a href="BD-detailView.html" className="ic_location"></a>
                  </div>
                </li>
                <li>
                  <b>라운지</b>
                  <div>
                    <a href="tel:000-0000" className="ic_phone"></a>
                    <a href="" className="ic_location"></a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="tab tab-west">
            <div className="map-box list">
              <img src="../images/img-map-west.jpg" alt="지도" />
            </div>
            <div className="list-store">
              <h3>1F 서관</h3>
              <ul>
                <li>
                  <b>사내병원</b>
                  <div>
                    <a href="tel:000-0000" className="ic_phone"></a>
                    <a href="BD-detailView.html" className="ic_location"></a>
                  </div>
                </li>
                <li>
                  <b>사내약국</b>
                  <div>
                    <a href="tel:000-0000" className="ic_phone"></a>
                    <a href="BD-detailView.html" className="ic_location"></a>
                  </div>
                </li>
                <li>
                  <b>사내은행</b>
                  <div>
                    <a href="tel:000-0000" className="ic_phone"></a>
                    <a href="BD-detailView.html" className="ic_location"></a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="tab tab-center">
            <div className="map-box list">
              <img src="../images/img-map-center.jpg" alt="지도" />
            </div>
            <div className="list-store">
              <h3>1F 중원</h3>
              <ul>
                <div className="noData">그랜드스테어 공간입니다.</div>
              </ul>
            </div>
          </div>
          <div className="tab tab-east">
            <div className="map-box list">
              <img src="../images/img-map-west.jpg" alt="지도" />
            </div>
            <div className="list-store">
              <h3>1F 동관</h3>
              <ul>
                <li>
                  <b>라운지</b>
                  <div>
                    <a href="tel:000-0000" className="ic_phone"></a>
                    <a href="" className="ic_location"></a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
