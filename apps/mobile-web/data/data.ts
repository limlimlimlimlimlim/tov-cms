import data1f from './data-1f';
import data2f from './data-2f';
import data3f from './data-3f';
import data5f from './data-5f';
import datab1 from './data-b1';
import datab2 from './data-b2';

const tree = [
  // data5f,
  // data3f,
  // data2f,
  data1f,
  // datab1,
  // datab2
];

const facility = [
  ...data5f.wing[0].facility,
  ...data3f.wing[0].facility,
  ...data2f.wing[0].facility,
  ...data1f.wing[0].facility,
  ...datab1.wing[0].facility,
  ...datab2.wing[0].facility,
];
export default { tree, facility };
