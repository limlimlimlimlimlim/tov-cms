'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useBuildingContext } from '@/app/context/building';

export default function WingPage() {
  const { floor, setFacility, wing }: any = useBuildingContext();
  const router = useRouter();
  const viewerRef = useRef<HTMLDivElement>(null);

  const onClickFacility = useCallback(
    (fac: any) => {
      setFacility(fac);
      router.push(`/building/${floor.id}/${wing.id}/${fac.id}`);
    },
    [floor.id, router, setFacility, wing.id],
  );

  const createFacility = useCallback(() => {
    if (!wing) return;
    return wing.facility.map((f: any, i: number) => {
      return (
        <li key={i}>
          <b>{f.name}</b>
          <div>
            <a href={`tel:${f.phone}`} className="ic_phone" />
            <a
              href="#"
              className="ic_location"
              onClick={(e) => {
                e.preventDefault();
                onClickFacility(f);
              }}
            />
          </div>
        </li>
      );
    });
  }, [onClickFacility, wing]);

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
  }));

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
          const { width, height, x, y } =
            viewerRef.current!.getBoundingClientRect();
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
      target: viewerRef,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 1, max: 2.5 }, rubberband: true },
    },
  );

  return (
    <div className="tab-wrap">
      <div className="tab tab-all view">
        <div
          className="map-box list"
          style={{ overflow: 'hidden', minHeight: 150 }}
        >
          <animated.div
            ref={viewerRef as any}
            style={{ ...style, touchAction: 'none' }}
          >
            {wing.image ? <img src={wing.image} alt="지도" /> : null}
          </animated.div>
        </div>

        <div className="list-store">
          <h3>
            {floor.floorName} {wing.name}
          </h3>
          {wing ? <ul>{createFacility()}</ul> : null}
        </div>
      </div>
    </div>
  );
}
