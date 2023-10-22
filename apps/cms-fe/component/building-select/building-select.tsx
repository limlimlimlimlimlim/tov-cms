import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getBuildingsByFloor, getFloors } from '../../api/building-info';

const { Option } = Select;

interface ComponentProps {
  floorId;
  style?;
  onChange?: (buildingId) => void;
}

export default function BuildingSelect({
  floorId,
  style,
  onChange,
}: ComponentProps) {
  const [buildings, setBuildings] = useState([]);
  const [building, setBuilding] = useState('');

  useEffect(() => {
    setBuilding('');
    setBuildings([]);
    if (onChange) onChange('');
    if (floorId === '') return;
    fetchData(floorId);
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
    <Select
      style={style}
      value={building}
      onChange={(value, ww) => {
        setBuilding(value);
        if (!onChange) return;
        onChange(value);
      }}
    >
      <Option key="all" value="">
        전체
      </Option>
      {createOptions()}
    </Select>
  );
}
