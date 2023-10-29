'use client';
import { useBuildingContext } from '@/app/context/building';
import { useCallback, useEffect, useState } from 'react';

export default function FacilityPage({ params }: any) {
  const { wing, facility, setFacility }: any = useBuildingContext();
  const [isShowDetail, setIsShowDetail] = useState(true);
  const [isShowMiniMap, setIsShowMiniMap] = useState(false);
  const [isShowLegend, setIsShowLegend] = useState(false);

  useEffect(() => {
    setCurrentFacility(params.facility);
  }, [wing]);

  const setCurrentFacility = useCallback(
    (facilityId: string) => {
      if (!wing) return;

      const currentFacility: any = wing.facility.find((fac: any) => {
        return fac.id.toString() === facilityId;
      });
      setFacility(currentFacility);
    },
    [wing],
  );

  return (
    <>
      <div className="tab-wrap">
        {facility && (
          <>
            <div className="map-box detail">
              {/* <button
                type="button"
                className="btn-location ic_location_c"
              ></button> */}
              <div
                className="map-area"
                onClick={() => {
                  setIsShowDetail(true);
                }}
              >
                <div style={{ marginTop: 90 }}>
                  <img
                    src={wing.image}
                    alt="지도"
                    style={{ position: 'absolute' }}
                  />
                  <img
                    src={facility.section}
                    alt="지도"
                    style={{ position: 'absolute' }}
                  />
                </div>
              </div>

              <div className={`aside miniMap ${isShowMiniMap ? 'on' : null}`}>
                <button
                  type="button"
                  className="btn-aside"
                  onClick={() => {
                    setIsShowMiniMap(true);
                  }}
                >
                  미니맵
                </button>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setIsShowMiniMap(false);
                  }}
                ></button>
                <img src="/images/img-miniMap.jpg" alt="" />
              </div>
              <div className={`aside legend ${isShowLegend ? 'on' : null}`}>
                <button
                  type="button"
                  className="btn-aside"
                  onClick={() => {
                    setIsShowLegend(true);
                  }}
                >
                  범 례
                </button>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setIsShowLegend(false);
                  }}
                ></button>
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
            <div
              className="aside-infowrap"
              style={{ display: isShowDetail ? 'block' : 'none' }}
            >
              <h3>{facility.name}</h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setIsShowDetail(false);
                }}
              ></button>
              <div className="cont">
                <div className="profile-box">
                  <img
                    src={
                      facility.image
                        ? facility.image
                        : '/images/ic_character_gray.svg'
                    }
                    alt=""
                  />
                </div>
                <div className="text-box">
                  <ul>
                    <li>
                      <a href="tel:02-0000-0000">
                        <i className="ic_phone"></i>
                        <p>{facility.phone}</p>
                      </a>
                    </li>
                    <li>
                      <i className="ic_location"></i>
                      <p>{facility.address}</p>
                    </li>
                    <li>
                      <i className="ic_note"></i>
                      <p>
                        {facility.description}
                        <br />
                        운영시간 : {facility.openingHours}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
