'use client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useBuildingContext } from '@/app/context/building';

export default function WingPage() {
  const { floor, setFacility, wing }: any = useBuildingContext();
  const router = useRouter();

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

  return (
    <div className="tab-wrap">
      <div className="tab tab-all view">
        <div className="map-box list">
          {wing.image ? <img src={wing.image} alt="지도" /> : null}
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
