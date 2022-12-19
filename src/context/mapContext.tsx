import { createContext, ReactNode, useContext, useState } from "react";

type MapProviderProps = {
  children: ReactNode;
};

type MapItem = {
  id: number;
  quantity: number;
  product: any;
};

type MapContext = {
  init: any;
};

const MapContext = createContext({} as MapContext);

export function useMap() {
  return useContext(MapContext);
}
export function MapProvider({ children }: MapProviderProps) {
  const [MapItems, setMapItems] = useState<MapItem[]>([]);

  return (
    <MapContext.Provider
      value={{
        init: () => {},
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
