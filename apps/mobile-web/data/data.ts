import data1f from './data-1f';
import data2f from './data-2f';
import data3f from './data-3f';
import data5f from './data-5f';
import datab1 from './data-b1';
import datab2 from './data-b2';

const tree = [data5f, data3f, data2f, data1f, datab1, datab2];

const facility = tree.reduce((acc: any[], floor: any) => {
  const facilities = floor.wing.reduce((acc2: any[], w: any) => {
    acc2.push(...w.facility);
    return acc2;
  }, []);
  acc.push(...facilities);
  return acc;
}, []);

export default { tree, facility };
