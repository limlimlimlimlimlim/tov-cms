import { Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getSubCategory } from '../../api/category';

const { Option } = Select;

interface ComponentProps {
  id?;
  categoryId?;
  style?;
  useAll?;
  onChange?: (wingId) => void;
}

export default function SubCategorySelect({
  id = '',
  categoryId = '',
  useAll = false,
  style,
  onChange,
}: ComponentProps) {
  const [subs, setSubs] = useState<any[]>();

  const fetchData = useCallback(async () => {
    const result = await getSubCategory(categoryId);
    setSubs(result.data);
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;
    void fetchData();
  }, [categoryId, fetchData, onChange]);

  const createOptions = useCallback(() => {
    return subs?.map((fac: any) => (
      <Option key={fac.id} value={fac.id}>
        {fac.name}
      </Option>
    ));
  }, [subs]);

  return (
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
  );
}
