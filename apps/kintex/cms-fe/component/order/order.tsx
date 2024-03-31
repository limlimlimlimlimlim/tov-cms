import { Button, Flex, InputNumber } from 'antd';
import { useEffect, useState } from 'react';

interface ComProps {
  value: number;
  onValidate: (value: number) => Promise<boolean>;
  onChange: (value: number) => void;
}

const Order = (props: ComProps) => {
  const { value, onValidate, onChange } = props;
  const [originOrder, setOriginOrder] = useState<number>(0);
  const [orderValue, setOrderValue] = useState<number>(0);

  useEffect(() => {
    setOriginOrder(value);
    setOrderValue(value);
  }, [value]);
  return (
    <Flex gap="small">
      <InputNumber
        value={orderValue}
        size="small"
        style={{ width: 70 }}
        onChange={(value: number) => {
          setOrderValue(value);
        }}
      />
      <Button
        size="small"
        onClick={async () => {
          if (await onValidate(orderValue)) {
            onChange(orderValue);
          } else {
            setOrderValue(originOrder);
          }
        }}
      >
        변경
      </Button>
    </Flex>
  );
};

export default Order;
