'use client';
import { useCallback, useEffect } from 'react';
import { useBuildingContext } from '@/app/context/building';
import { useRouter } from 'next/navigation';

export default function WingLayout({ params, children }: any) {
  const router = useRouter();
  const { data, floor, wing, setWing }: any = useBuildingContext();

  const onClickWing = useCallback(
    (currentWing: any) => {
      setWing(currentWing);
      router.replace(`/building/${floor.id}/${currentWing.id}`);
    },
    [data, floor],
  );

  useEffect(() => {
    if (!floor) return;
    setCurrentWing(params.wing);
  }, [floor]);

  const setCurrentWing = useCallback(
    (wingId: string) => {
      if (!floor) return;

      const currentWing: any = floor.wing.find((sec: any) => {
        return sec.id.toString() === wingId;
      });
      setWing(currentWing);
    },
    [floor],
  );

  const createWings = useCallback(() => {
    return floor.wing.map((w: any, i: number) => {
      return (
        <td
          key={i}
          className={wing && (wing as any).id == w.id ? 'on' : ''}
          onClick={() => {
            onClickWing(w);
          }}
        >
          {w.name}
        </td>
      );
    });
  }, [floor, wing]);

  return (
    <>
      {floor && floor.wing && floor.wing.length > 1 && (
        <div className="area-menu">
          <table>
            <tbody>
              <tr>{createWings()}</tr>
            </tbody>
          </table>
        </div>
      )}
      {wing && children}
    </>
  );
}
