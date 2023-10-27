'use client';
import { useBuildingContext } from '@/app/context/building';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function SectionPage() {
  const { floor, setFacility, section }: any = useBuildingContext();
  const router = useRouter();

  const onClickFacility = useCallback(
    (fac: any) => {
      setFacility(fac);
      router.push(`/building/${floor.id}/${section.id}/${fac.id}`);
    },
    [floor, section],
  );

  const createFacility = useCallback(() => {
    if (!section) return;
    return section.facility.map((fac: any, index: number) => {
      return (
        <li key={index}>
          <b>{fac.name}</b>
          <div>
            <a href={`tel:${fac.phone}`} className="ic_phone"></a>
            <a
              href="#"
              className="ic_location"
              onClick={(e) => {
                e.preventDefault();
                onClickFacility(fac);
              }}
            ></a>
          </div>
        </li>
      );
    });
  }, [section]);

  return (
    <>
      <div className="tab-wrap">
        <div className="tab tab-all view">
          <div className="map-box list">
            <img src={section.image} alt="지도" />
          </div>
          <div className="list-store">
            <h3>
              {floor.floorName} {section.name}
            </h3>
            {section && <ul>{createFacility()}</ul>}
          </div>
        </div>
      </div>
    </>
  );
}
