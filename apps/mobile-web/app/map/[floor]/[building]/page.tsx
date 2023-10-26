'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBuildingContext } from '@/app/context/building';

export default function FloorInfo({ children, params }: any) {
  const router = useRouter();
  const { floor, setFloor, building, setBuilding } = useBuildingContext();

  useEffect(() => {}, [floor, building]);

  const createItems = useCallback(() => {
    if (!building) return <></>;
    return building.facility.map((fac: any, index: number) => {
      return (
        <li key={index}>
          <b>{fac.name}</b>
          <div>
            <a href={`tel:${fac.phone}`} className="ic_phone"></a>
            <a href="BD-detailView.html" className="ic_location"></a>
          </div>
        </li>
      );
    });
  }, [floor, building]);

  return (
    <div className="tab tab-all view">
      <div className="map-box list">
        <img src={building?.image} alt="지도" />
      </div>
      <div className="list-store">
        <h3>
          {floor?.floorName} {building?.name}
        </h3>
        <ul>{createItems()}</ul>
      </div>
    </div>
  );
}
