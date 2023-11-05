/* eslint-disable no-param-reassign */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useBuildingContext } from '@/app/context/building';

const maxScale = 2;
const minimapMinScale = 1 / maxScale;

export default function FacilityPage({ params }: any) {
  const { wing, facility, setFacility }: any = useBuildingContext();
  const [isShowDetail, setIsShowDetail] = useState(true);
  const [isShowMiniMap, setIsShowMiniMap] = useState(false);
  const [isShowLegend, setIsShowLegend] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const miniImageContainerRef = useRef<HTMLDivElement>(null);
  const miniImageContainerRef2 = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const miniImageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });
  const [viewportTransform, setViewportTransform] = useState({
    x: 0,
    y: 0,
    s: 1,
  });

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

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));

  const updateViewport = useCallback(() => {
    if (!viewerRef.current) return;
    if (!imageContainerRef.current) return;
    if (!miniImageRef.current) return;
    const viewerStyle = window.getComputedStyle(viewerRef.current);
    const viewerTransform = viewerStyle.getPropertyValue('transform');
    const viewerMatrix = new DOMMatrix(viewerTransform);
    const viewerTranslateX = viewerMatrix.m41;
    const viewerTranslateY = viewerMatrix.m42;
    const viewerScale = viewerMatrix.a;

    const viewportTranslateX =
      ((viewportSize.w - 0) / (0 - imageContainerRef.current.clientWidth)) *
      viewerTranslateX;

    const viewportTranslateY =
      ((viewportSize.h - 0) / (0 - imageContainerRef.current.clientHeight)) *
      viewerTranslateY;

    const viewportScale =
      ((1 - minimapMinScale) / (1 - maxScale)) * (viewerScale - maxScale) +
      minimapMinScale;

    setViewportTransform({
      x: viewportTranslateX / viewerScale,
      y: viewportTranslateY / viewerScale,
      s: viewportScale,
    });
  }, [viewportSize.h, viewportSize.w]);

  useGesture(
    {
      // onHover: ({ active, event }) => console.log('hover', event, active),
      // onMove: ({ event }) => console.log('move', event),
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        api.start({ x, y });
        updateViewport();
      },
      onPinch: ({
        origin: [ox, oy],
        first,
        movement: [ms],
        offset: [s],
        memo,
      }) => {
        if (first) {
          const { width, height, x, y } =
            viewerRef.current!.getBoundingClientRect();
          const tx = ox - (x + width / 2);
          const ty = oy - (y + height / 2);
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo[0] - (ms - 1) * memo[2];
        const y = memo[1] - (ms - 1) * memo[3];
        api.start({ scale: s, rotateZ: 0, x, y });
        updateViewport();
        return memo;
      },
    },
    {
      target: viewerRef,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 1, max: maxScale }, rubberband: true },
    },
  );

  useEffect(() => {
    updateViewport();
  }, [updateViewport, viewportSize]);

  return (
    <div className="tab-wrap">
      {facility ? (
        <>
          <div className="map-box detail">
            <div
              className="map-area"
              ref={imageContainerRef}
              onClick={() => {
                setIsShowDetail(true);
              }}
            >
              <animated.div
                ref={viewerRef as any}
                style={{
                  ...style,
                  touchAction: 'none',
                  transform: `translate3d(0px, 90px, 0px) scale(1) rotateZ(0deg)`,
                }}
              >
                <img
                  ref={imageRef as any}
                  src={wing.image}
                  alt="지도"
                  style={{ position: 'absolute' }}
                />
                <img
                  src={facility.section}
                  alt="지도"
                  style={{ position: 'absolute' }}
                />
                <button
                  type="button"
                  className="btn-location ic_location_c"
                  style={{ top: facility.y, left: facility.x }}
                />
              </animated.div>
            </div>

            <div
              ref={miniImageContainerRef as any}
              className={`aside miniMap ${isShowMiniMap ? 'on' : null}`}
            >
              <button
                type="button"
                className="btn-aside"
                onClick={() => {
                  setIsShowMiniMap(true);
                  setTimeout(() => {
                    if (!viewportRef.current) return;
                    if (!viewerRef.current) return;
                    if (!miniImageRef.current) return;
                    if (!imageContainerRef.current) return;
                    if (!imageRef.current) return;

                    const ratio = {
                      w:
                        imageContainerRef.current.clientWidth /
                        viewerRef.current.clientWidth,
                      h:
                        imageContainerRef.current.clientHeight /
                        imageRef.current.clientHeight,
                    };

                    setViewportSize({
                      w: miniImageRef.current.clientWidth * ratio.w,
                      h: miniImageRef.current.clientHeight * ratio.h,
                    });
                  }, 0);
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
              <div
                ref={miniImageContainerRef2 as any}
                style={{
                  width: 'calc(100% - 24px)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img ref={miniImageRef as any} src={wing?.image} alt="" />
                <div
                  ref={viewportRef}
                  style={{
                    position: 'absolute',
                    background: 'rgba(230,240,150,0.4)',
                    display: isShowMiniMap ? 'block' : 'none',
                    width: viewportSize.w,
                    height: viewportSize.h,
                    transformOrigin: 'center top',
                    transform: `translate3d(${viewportTransform.x}px, ${viewportTransform.y}px, 0px) scale(${viewportTransform.s}) rotateZ(0deg)`,
                  }}
                />
              </div>
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
