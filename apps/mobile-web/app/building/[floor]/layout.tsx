'use client';
import { useCallback, useEffect } from 'react';
import { useBuildingContext } from '@/app/context/building';
import { useRouter } from 'next/navigation';

export default function FloorLayout({ params, children }: any) {
  const router = useRouter();
  const { data, floor, setFloor }: any = useBuildingContext();

  const onClickFloor = useCallback(
    (currentFloor: any) => {
      setFloor(currentFloor);
      router.replace(
        `/building/${currentFloor.id}/${currentFloor.section[0].id}`,
      );
    },
    [data],
  );

  useEffect(() => {
    if (floor) return;
    setCurrentFloor(params.floor);
  }, [data]);

  const setCurrentFloor = useCallback(
    (floorId: string) => {
      if (!data) return;
      const currentFloor: any = data.find((f: any) => {
        return f.id.toString() === floorId;
      });
      setFloor(currentFloor);
    },
    [data],
  );

  const createFloors = useCallback(() => {
    return data.map((f: any, index: number) => {
      return (
        <li
          key={index}
          className={floor && (floor as any).id == f.id ? 'active' : ''}
          onClick={() => {
            onClickFloor(f);
          }}
        >
          {f.floorName}
        </li>
      );
    });
  }, [data, floor]);

  return (
    <>
      {data && (
        <>
          <div className="floor-menu">
            {' '}
            <ul>{createFloors()}</ul>
          </div>
          {children}
        </>
      )}
    </>
  );
}
