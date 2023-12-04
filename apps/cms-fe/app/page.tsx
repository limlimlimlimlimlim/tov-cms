import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/map/list');
  return <>hello!!</>;
}
