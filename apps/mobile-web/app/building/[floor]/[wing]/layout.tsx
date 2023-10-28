'use client';
import { useCallback, useEffect } from 'react';
import { useBuildingContext } from '@/app/context/building';
import { useRouter } from 'next/navigation';

export default function SectionLayout({ params, children }: any) {
  const router = useRouter();
  const { data, floor, section, setSection }: any = useBuildingContext();

  const onClickSection = useCallback(
    (currentSection: any) => {
      setSection(currentSection);
      router.replace(`/building/${floor.id}/${currentSection.id}`);
    },
    [data, floor],
  );

  useEffect(() => {
    if (!floor) return;
    setCurrentSection(params.wing);
  }, [floor]);

  const setCurrentSection = useCallback(
    (sectionId: string) => {
      if (!floor) return;

      const currentSection: any = floor.wing.find((sec: any) => {
        return sec.id.toString() === sectionId;
      });
      setSection(currentSection);
    },
    [floor],
  );

  const createSections = useCallback(() => {
    return floor.wing.map((sec: any, index: number) => {
      return (
        <td
          key={index}
          className={section && (section as any).id == sec.id ? 'on' : ''}
          onClick={() => {
            onClickSection(sec);
          }}
        >
          {sec.name}
        </td>
      );
    });
  }, [floor, section]);

  return (
    <>
      {data && floor && (
        <>
          <div className="area-menu">
            <table>
              <tbody>
                <tr>{createSections()}</tr>
              </tbody>
            </table>
          </div>
          {section && children}
        </>
      )}
    </>
  );
}
