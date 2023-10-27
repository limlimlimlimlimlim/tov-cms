'use client';

import { createContext, useContext, useState } from 'react';

const BuildingContext = createContext({});

export const BuildingContextProvider = ({ children }: any) => {
  const [data, setData] = useState();
  const [floor, setFloor] = useState();
  const [building, setBuilding] = useState();
  const [section, setSection] = useState();
  const [facility, setFacility] = useState();

  return (
    <BuildingContext.Provider
      value={{
        data,
        setData,
        floor,
        setFloor,
        building,
        setBuilding,
        section,
        setSection,
        facility,
        setFacility,
      }}
    >
      {children}
    </BuildingContext.Provider>
  );
};

export const useBuildingContext = () => useContext(BuildingContext);
