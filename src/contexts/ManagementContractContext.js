import React, { createContext, useState, useEffect } from 'react';
import APIConfig from '../utils/APIConfig';
import { useUser } from './UserContext';
const ManagementContractContext = createContext();


export const ManagementContractProvider = ({ children }) => {
  const { getProfileId } = useUser();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [feeBases, setFeeBases] = useState(null);
  const [defaultContractFees, setDefaultContractFees] = useState([]);

  const fetchFeeBases = async () => {
    try {
        const response = await fetch(`${APIConfig.baseURL.dev}/lists`);
        const data = await response.json();
        const bases = data.result.filter( item => item.list_category === "basis").filter(item => (item.list_item != null && item.list_item.trim() !== ""));
        setFeeBases(bases);
    } catch (error) {
        console.error("Error fetching fee bases:", error);
    }
  };

  const fetchDefaultContractFees = async () => {
    try {
        const response = await fetch(`${APIConfig.baseURL.dev}/profile/${getProfileId()}`);
        const data = await response.json();
        // console.log("DATA PROFILE", data);

        if (data?.profile?.result && data?.profile?.result?.length > 0) {
            const profileFees = data?.profile?.result[0].business_services_fees
                ? JSON.parse(data?.profile?.result[0].business_services_fees)
                : [];
            
            setDefaultContractFees(profileFees);
        }
    } catch (error) {
        console.error("Error fetching profile data: ", error);
    }
};
  
  useEffect(() => {
    if (!dataLoaded) {
      setDataLoaded(true);      
      
      fetchFeeBases();
      fetchDefaultContractFees();
    }
  }, [dataLoaded]);

  return (
    <ManagementContractContext.Provider value={{ feeBases, defaultContractFees, dataLoaded }}>
      {children}
    </ManagementContractContext.Provider>
  );
};


export default ManagementContractContext;
