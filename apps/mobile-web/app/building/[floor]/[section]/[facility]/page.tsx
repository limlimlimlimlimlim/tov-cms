'use client';
import { useBuildingContext } from '@/app/context/building';
import { useCallback, useEffect } from 'react';

export default function FacilityPage({ params }: any) {
  const { section, facility, setFacility }: any = useBuildingContext();

  useEffect(() => {
    setCurrentFacility(params.facility);
  }, [section]);

  const setCurrentFacility = useCallback(
    (facilityId: string) => {
      if (!section) return;

      const currentFacility: any = section.facility.find((fac: any) => {
        return fac.id.toString() === facilityId;
      });
      setFacility(currentFacility);
    },
    [section],
  );
  return (
    <>
      <div className="tab-wrap">
        {facility && (
          <>
            <div className="map-box detail">
              {/* <!-- <button type="button" className="btn-location ic_location_c"></button> --> */}
              <div className="map-area">
                <img src={facility.image} alt="지도" />
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
              <h3>{facility.name}</h3>
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
