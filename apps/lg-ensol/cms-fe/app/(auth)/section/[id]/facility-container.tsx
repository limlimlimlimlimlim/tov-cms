import { Drawer } from 'antd';

interface Props {
  onClose: () => void;
  open: boolean;
}

const FacilityContainer = ({ onClose, open }: Props) => {
  return (
    <Drawer
      title="시설 목록"
      placement="right"
      width={500}
      onClose={onClose}
      open={open}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  );
};

export default FacilityContainer;
