'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBuildingContext } from '@/app/context/building';

export default function FloorLayout({ params, children }: any) {
  const router = useRouter();
  const { data, floor, setFloor }: any = useBuildingContext();
  const [items, setItems] = useState([]);
  const activeFloorElement = useRef(null);

  const onClickFloor = useCallback(
    (currentFloor: any) => {
      setFloor(currentFloor);
      router.replace(`/building/${currentFloor.id}/${currentFloor.wing[0].id}`);
    },
    [router, setFloor],
  );

  const setCurrentFloor = useCallback(
    (floorId: string) => {
      if (!data) return;
      const currentFloor: any = data.find((f: any) => {
        return f.id.toString() === floorId;
      });
      setFloor(currentFloor);
    },
    [data, setFloor],
  );

  useEffect(() => {
    if (!data) return;
    setCurrentFloor(params.floor);
  }, [data, params.floor, setCurrentFloor]);

  const createFloors = useCallback(() => {
    return data.map((f: any, index: number) => {
      const isActive = floor && (floor as any).id == f.id;
      return (
        <li
          key={index}
          className={isActive ? 'active' : ''}
          ref={isActive ? activeFloorElement : null}
          onClick={() => {
            onClickFloor(f);
          }}
        >
          {f.floorName}
        </li>
      );
    });
  }, [data, floor, onClickFloor]);

  useEffect(() => {
    setItems(createFloors());
  }, [createFloors]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!activeFloorElement.current) {
      return;
    }
    (activeFloorElement.current as HTMLElement).scrollIntoView({
      block: 'nearest',
    });
  }, [items]);

  return (
    <>
      {data ? (
        <>
          <div className="floor-menu">
            {' '}
            <ul>{items}</ul>
          </div>
          {children}
        </>
      ) : null}
    </>
  );
}
