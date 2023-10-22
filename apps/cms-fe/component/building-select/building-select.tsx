import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getBuildingsByFloor, getFloors } from '../../api/building-info';

const { Option } = Select;

interface ComponentProps {
  floorId;
  buildingId?;
  style?;
  onChange?: (buildingId) => void;
}

export default function BuildingSelect({
  floorId,
  buildingId,
  style,
  onChange,
}: ComponentProps) {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    if (floorId) {
      fetchData(floorId);
    } else {
      setBuildings([]);
      if (onChange) onChange('');
    }
  }, [floorId]);

  const fetchData = async (id) => {
    const buildings = await getBuildingsByFloor(id);
    setBuildings(buildings.data);
  };

  const createOptions = useCallback(() => {
    return buildings.map((building: any) => (
      <Option key={building.id} value={building.id}>
        {building.name}
      </Option>
    ));
  }, [buildings]);
  return (
    <>
      <Select
        style={style}
        value={buildingId}
        onChange={(value) => {
          if (!onChange) return;
          onChange(value);
        }}
      >
        <Option key="all" value="">
          전체
        </Option>
        {createOptions()}
      </Select>
    </>
  );
}
