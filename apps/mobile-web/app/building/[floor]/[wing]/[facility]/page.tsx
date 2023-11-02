'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { folder, useControls } from 'leva';
import { useBuildingContext } from '@/app/context/building';
import { useGesture, usePinch } from '@use-gesture/react';

export default function FacilityPage({ params }: any) {
  const { wing, facility, setFacility }: any = useBuildingContext();
  const [isShowDetail, setIsShowDetail] = useState(true);
  const [isShowMiniMap, setIsShowMiniMap] = useState(false);
  const [isShowLegend, setIsShowLegend] = useState(false);

  const setCurrentFacility = useCallback(
    (facilityId: string) => {
      if (!wing) return;

      const currentFacility: any = wing.facility.find((fac: any) => {
        return fac.id.toString() === facilityId;
      });
      setFacility(currentFacility);
    },
    [setFacility, wing],
  );

  useEffect(() => {
    setCurrentFacility(params.facility);
  }, [params.facility, setCurrentFacility, wing]);

  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      document.removeEventListener('gestureend', handler);
    };
  }, []);

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));
  const ref = useRef<HTMLDivElement>(null);

  useGesture(
    {
      // onHover: ({ active, event }) => console.log('hover', event, active),
      // onMove: ({ event }) => console.log('move', event),
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        api.start({ x, y });
      },
      onPinch: ({ origin: [ox, oy], first, offset: [s], memo }) => {
        if (first) {
          const { width, height, x, y } = ref.current!.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          // eslint-disable-next-line no-param-reassign
          memo = [style.x.get(), style.y.get(), tx, ty];
        }
        api.start({ scale: s, rotateZ: 0 });
        return memo;
      },
    },
    {
      target: ref,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 1, max: 2.5 }, rubberband: true },
    },
  );

  return (
    <div className="tab-wrap">
      {facility ? (
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
              <animated.div
                ref={ref as any}
                style={{ ...style, touchAction: 'none', paddingTop: 90 }}
              >
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
              </animated.div>
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
              />
              <img src={wing?.image} alt="" />
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
              />
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
            />
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
                      <i className="ic_phone" />
                      <p>{facility.phone}</p>
                    </a>
                  </li>
                  <li>
                    <i className="ic_location" />
                    <p>{facility.address}</p>
                  </li>
                  <li>
                    <i className="ic_note" />
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
      ) : null}
    </div>
  );
}
