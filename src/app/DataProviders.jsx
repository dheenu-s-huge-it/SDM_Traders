"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { axiosGet } from "../lib/api";
import { accessToken } from "mapbox-gl";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [bankTypes, setBankTypes] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [GroupTypes, setGroupTypes] = useState([]);

  useEffect(() => {
    getStateList();
  }, []);

  const ACCESS_TOKEN = Cookies?.get("token");



  const getStateList = () => {
    axiosGet
      .get(
        `master/state/get?access_token=${ACCESS_TOKEN}&active_status=1&items_per_page=10000`
      )
      .then((response) => {
        // Handle the successful response here
        setStateList(response.data.data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };

  const getGroupList = () => {
    axiosGet
      .get(
        `master/group/get?access_token=${ACCESS_TOKEN}&active_status=1&items_per_page=10000`
      )
      .then((response) => {
        // Handle the successful response here
        setGroupTypes(response.data.data);
      })
      .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
      });
  };


  const authContextValue = {
    bankTypes,
    setBankTypes,
    setGroupTypes,
    getGroupList,
    stateList,
    setStateList,
    getStateList,
  };
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
