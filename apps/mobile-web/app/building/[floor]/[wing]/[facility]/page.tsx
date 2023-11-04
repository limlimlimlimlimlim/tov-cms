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
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ w: 0, h: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const [interactiveType, setInteractiveType] = useState('');

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

  const updateViewportPosition = useCallback(
    (x: number, y: number) => {
      if (!imageContainerRef.current) return;
      if (!miniImageContainerRef2.current) return;
      if (!viewerRef.current) return;
      const imageContainerRect =
        imageContainerRef.current.getBoundingClientRect();
      const imageWidth = imageContainerRect.width * imageScale;
      const imageX = imageContainerRef.current.clientLeft;
      const miniImageX = miniImageContainerRef2.current.clientLeft;

      const imageHeight = imageContainerRect.height * imageScale;
      const imageY = imageContainerRef.current.clientTop;
      const miniImageY = viewerRef.current.clientTop;
      const viewportRect = viewportRef.current.getBoundingClientRect();
      console.log(viewportRect);
      const miniImageRect = miniImageRef.current.getBoundingClientRect();
      const miniImageWidth = miniImageRect.width;
      const miniImageHeight = miniImageRect.height;
      console.log(
        'miniImageWidth : ',
        miniImageWidth,
        'imageScale : ',
        imageScale,
      );
      const targetX =
        ((0 - miniImageWidth) / (imageWidth - imageX)) * (x - imageX) +
        miniImageX;

      const targetY =
        ((0 - miniImageHeight) / (imageHeight - imageY)) * (y - imageY) +
        miniImageY;

      setViewportPosition({ x: targetX, y: targetY });
    },
    [imageScale],
  );

  const updateViewportSize = useCallback(() => {
    if (!imageContainerRef.current) return;
    if (!viewerRef.current) return;
    if (!imageRef.current) return;
    if (!miniImageRef.current) return;
    const viewportScale =
      ((1 - minimapMinScale) / (1 - maxScale)) * (imageScale - maxScale) +
      minimapMinScale;
    (
      viewportRef.current as HTMLElement
    ).style.transform = `scale(${viewportScale})`;
  }, [imageScale]);

  useEffect(() => {
    if (!imageContainerRef.current) return;
    const imageRect = imageContainerRef.current.getBoundingClientRect();
    const imageWidth = imageRect.width * imageScale;
    const imageHeight = imageRect.height * imageScale;
    if (interactiveType === 'drag') {
      const originW = imageWidth / imageScale;
      const originX = imagePosition.x - (imageWidth - originW) / 2;
      // console.log('--------------------------', interactiveType);
      // console.log('imagePosition : ', imagePosition);
      // console.log('originX : ', imagePosition.x);
      // console.log('measureX : ', originX);
      // console.log('imageScale : ', imageScale);
      updateViewportPosition(originX, imagePosition.y);
    } else {
      //
      // updateViewportPosition;
      updateViewportSize();
    }

    // updateViewportSize();
    // console.log('--------------------------', interactiveType);
    // console.log('imagePosition : ', imagePosition);
    // if (imageScale > 1) {
    //   const { w } = imageSize;
    //   const originW = w / imageScale;
    //   const originX = imagePosition.x - (w - originW) / 2;

    //   console.log('originX : ', originX);
    // }
    // console.log('imageSize : ', imageSize);
    // console.log('imageScale : ', imageScale);
  }, [
    imagePosition,
    imageScale,
    interactiveType,
    updateViewportPosition,
    updateViewportSize,
  ]);

  useGesture(
    {
      // onHover: ({ active, event }) => console.log('hover', event, active),
      // onMove: ({ event }) => console.log('move', event),
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel();
        setInteractiveType('drag');
        api.start({ x, y });
        setImagePosition({ x, y });
        // updateViewportPosition(x, y);
      },
      onPinch: ({ origin: [ox, oy], first, offset: [s], memo }) => {
        setInteractiveType('pinch');
        const { width, height, x, y } =
          viewerRef.current!.getBoundingClientRect();
        const tx = ox - (x + width / 2);
        const ty = oy - (y + height / 2);
        if (first) {
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        api.start({ scale: s, rotateZ: 0 });
        setImageScale(s);
        setImagePosition({ x, y });
        // updateViewportPosition(x, y - 190);
        // updateViewportSize();
        // scale.current = s;
        return memo;
      },
    },
    {
      target: viewerRef,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 1, max: maxScale }, rubberband: true },
    },
  );

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
                  border: '1px solid gray',
                }}
              >
                <img
                  ref={imageRef as any}
                  src={wing.image}
                  alt="지도"
                  style={{ position: 'absolute', border: '1px solid red' }}
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
                    // setViewportPosition({ x: 0, y: 0 });

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
                  // overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <img ref={miniImageRef as any} src={wing?.image} alt="" />
                <div
                  ref={viewportRef}
                  style={{
                    position: 'absolute',
                    border: '1px solid silver',
                    display: isShowMiniMap ? 'block' : 'none',
                    left: viewportPosition.x,
                    top: viewportPosition.y,
                    width: viewportSize.w,
                    height: viewportSize.h,
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
