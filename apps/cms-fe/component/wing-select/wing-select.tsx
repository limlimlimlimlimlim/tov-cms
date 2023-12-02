import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getWings } from '../../api/building-info';

const { Option } = Select;

interface ComponentProps {
  wingId?;
  style?;
  onChange?: (wingId) => void;
}

export default function WingSelect({
  wingId = '',
  style,
  onChange,
}: ComponentProps) {
  const [wings, setWings] = useState([]);

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
      style={style}
      value={wingId}
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
  );
}
