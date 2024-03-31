import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getCategory } from '../../api/category';

const { Option } = Select;

interface ComponentProps {
  id?;
  style?;
  useAll?;
  onChange?: (wingId) => void;
}

export default function CategorySelect({
  id = '',
  useAll = false,
  style,
  onChange,
}: ComponentProps) {
  const [facilities, setFacilities] = useState<any[]>();

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getCategory();
    setFacilities(result.data);
  };

  const createOptions = useCallback(() => {
    return facilities?.map((fac: any) => (
      <Option key={fac.id} value={fac.id}>
        {fac.name}
      </Option>
    ));
  }, [facilities]);

  return (
    <>
      {facilities && (
        <Select
          placeholder="선택"
          style={style}
          value={id}
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
