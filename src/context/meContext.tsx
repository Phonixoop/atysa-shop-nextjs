import { createContext, ReactNode, useContext, useState } from "react";
// import { ShoppingBasket } from "../components/ShoppingBasket"
import { useQuery } from "@tanstack/react-query";
import { getUser } from "api";

type MeProviderProps = {
  children: ReactNode;
};

type MeContext = {
  data: any;
  authenticated: boolean;
  loading: boolean;
  refetch: () => {};
};

const MeContext = createContext({} as MeContext);

export function useMe() {
  return useContext(MeContext);
}
export function MeProvider({ children }: MeProviderProps) {
  const { data, isSuccess, isLoading, refetch } = useQuery(
    ["user"],
    () => {
      return getUser();
    },
    {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <MeContext.Provider
      value={{
        data: data?.data?.user,
        authenticated: data !== undefined || data !== null,
        loading: isLoading,
        refetch,
      }}
    >
      {children}
      {/* <ShoppingBasket isOpen={isOpen} /> */}
    </MeContext.Provider>
  );
}
