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
  const [wings, setWings] = useState<any[]>();

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getWings();
    setWings(result.data);
  };

  const createOptions = useCallback(() => {
    return wings?.map((wing: any) => (
      <Option key={wing.id} value={wing.id}>
        {wing.name}
      </Option>
    ));
  }, [wings]);
  return (
    <>
      {wings && (
        <Select
          placeholder="선택"
          style={style}
          value={wingId}
          onChange={(value) => {
            if (!onChange) return;
            onChange(value);
          }}
        >
          {useAll ? (
            <Option key="all" value="">
              전체
            </Option>
          ) : null}

          {createOptions()}
        </Select>
      )}
    </>
  );
}
