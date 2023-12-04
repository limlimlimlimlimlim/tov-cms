import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getWings } from '../../api/building-info';

const { Option } = Select;

interface ComponentProps {
  wingId?;
  style?;
  useAll?;
  onChange?: (wingId) => void;
}

export default function WingSelect({
  wingId = '',
  useAll = false,
  style,
  onChange,
}: ComponentProps) {
  const [wings, setWings] = useState([]);
  const [selectedWing, setSelectedWing] = useState(wingId);

  useEffect(() => {
    void fetchData();
  }, [onChange]);

  const fetchData = async () => {
    const result = await getWings();
    setWings(result.data);
  };

  const createOptions = useCallback(() => {
    return wings.map((building: any) => (
      <Option key={building.id} value={building.id}>
        {building.name}
      </Option>
    ));
  }, [wings]);
  return (
    <Select
      placeholder="선택"
      style={style}
      value={selectedWing}
      onChange={(value) => {
        if (!onChange) return;
        onChange(value);
        setSelectedWing(value);
      }}
    >
      {useAll ? (
        <Option key="all" value="">
          전체
        </Option>
      ) : null}

      {createOptions()}
    </Select>
  );
}
