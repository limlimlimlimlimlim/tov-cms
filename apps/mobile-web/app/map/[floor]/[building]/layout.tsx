'use client';
import { useCallback, useEffect, useState } from 'react';
import dummyData from '../../../../data/data';
import { useRouter } from 'next/navigation';
import { useBuildingContext } from '@/app/context/building';

export default function BuildingMap({ children, params }: any) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const { floor, setFloor, building, setBuilding } = useBuildingContext();

  useEffect(() => {
    setData(dummyData.tree as any);
    const floor: any = dummyData.tree.find((item) => item.id == params.floor);
    setFloor(floor);
    setBuilding(floor?.maps[0]);
  }, []);

  const onClickFloor = useCallback(
    (floor: any) => {
      setFloor(floor);
      setBuilding(floor.maps[0]);
    },
    [data],
  );

  const createFloor = useCallback(() => {
    return data.map((f: any, index: number) => {
      return (
        <li
          key={index}
          className={(floor as any).id == f.id ? 'active' : ''}
          onClick={() => {
            onClickFloor(f);
          }}
        >
          {f.floorName}
        </li>
      );
    });
  }, [data, floor]);

  const onClickBuilding = useCallback((building: any) => {
    setBuilding(building);
  }, []);

  const createMapTabs = useCallback(() => {
    if (!floor) return <></>;
    return (floor as any).maps.map((map: any, index: number) => {
      return (
        <td
          key={index}
          className={building.id == map.id ? 'on' : ''}
          onClick={() => {
            onClickBuilding(map);
          }}
        >
          {map.name}
        </td>
      );
    });
  }, [data, floor, building]);

  const onClickSearch = useCallback(() => {
    router.push('/search');
  }, []);

  return (
    <>
      <header className="header">
        <div>
          <button className="btn-back" onClick={router.back}></button>
          <h2>빌딩안내</h2>
          <button className="btn-home"></button>
          <button className="btn-menu"></button>
        </div>
      </header>

      <section className="form-search">
        <input
          type="button"
          className="ip-srchForm"
          value="초성만 입력해도 검색이 가능합니다."
          onClick={onClickSearch}
        />
      </section>

      <section className="content">
        <div className="floor-menu">
          <ul>{createFloor()}</ul>
        </div>
        <div className="area-menu">
          <table>
            <tbody>
              <tr>{createMapTabs()}</tr>
            </tbody>
          </table>
        </div>

        <div className="tab-wrap">{children}</div>
      </section>
    </>
  );
}
