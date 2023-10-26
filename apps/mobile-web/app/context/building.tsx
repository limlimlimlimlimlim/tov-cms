'use client';

import { createContext, useContext, useState } from 'react';

const BuildingContext = createContext({});

export const BuildingContextProvider = ({ children }: any) => {
  const [floor, setFloor] = useState();
  const [building, setBuilding] = useState();
  const [facility, setFacility] = useState();

  return (
    <BuildingContext.Provider
      value={{ floor, setFloor, building, setBuilding, facility, setFacility }}
    >
      {children}
    </BuildingContext.Provider>
  );
};

export const useBuildingContext = () => useContext(BuildingContext);
