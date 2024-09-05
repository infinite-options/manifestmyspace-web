import React, { createContext, useState, useEffect } from 'react';
import APIConfig from '../utils/APIConfig';
import { useUser } from './UserContext';
const ManagementContractContext = createContext();


export const ManagementContractProvider = ({ children }) => {
  const { getProfileId } = useUser();
  const [ dataLoaded, setDataLoaded ] = useState(false);
  const [ feeBases, setFeeBases ] = useState(null);
  const [ defaultContractFees, setDefaultContractFees ] = useState([]);
  const [ allContracts, setAllContracts ] = useState([]);
  const [ currentContractUID, setCurrentContractUID  ] = useState("");
  const [ currentContractPropertyUID, setCurrentContractPropertyUID ] = useState("");
  const [ contractRequests, setContractRequests ] = useState([]);

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

  const fetchContracts = async () => {						
		  const result = await fetch(`${APIConfig.baseURL.dev}/contracts/${getProfileId()}`);
		  const data = await result.json();
		  // console.log("--debug--", data);
		  // const contractData = data["result"].find(contract => contract.contract_property_id === contractPropertyID && contract.contract_status === "NEW");
		  // const contractData = data["result"].find(contract => contract.contract_property_id === contractPropertyID && contract.contract_status === ("NEW"||"SENT"));
	
		  if (data !== "No records for this Uid") {
			  setAllContracts(data["result"]);
        if(currentContractUID === "" && currentContractPropertyUID === ""){
          setCurrentContractUID(data?.result[0]?.contract_uid)
          setCurrentContractPropertyUID(data?.result[0]?.contract_property_id)
        }
		  }
		
	};

  const fetchContractRequests = async () => {    
    const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/${getProfileId()}`);
    // const response = await fetch(`${APIConfig.baseURL.dev}/dashboard/600-000003`);

    try {
      const jsonData = await response.json();
      // console.log("Manager Dashboard jsonData: ", jsonData);
      // NEW PM REQUESTS
      const requests = jsonData?.NewPMRequests?.result;
      setContractRequests(requests);
      // setCurrentContractUID(requests[0]?.contract_uid)
      // setCurrentContractPropertyUID(requests[0]?.property_uid)
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    if (!dataLoaded) {
      setDataLoaded(true);      
      
      fetchFeeBases();
      fetchDefaultContractFees();
      fetchContracts();
      fetchContractRequests();
    }
  }, [dataLoaded]);

  return (
    <ManagementContractContext.Provider 
      value={{ 
        feeBases,
        defaultContractFees,
        allContracts,
        contractRequests,
        currentContractUID,
        setCurrentContractUID,
        currentContractPropertyUID,
        setCurrentContractPropertyUID,
        dataLoaded 
      }}
    >
      {children}
    </ManagementContractContext.Provider>
  );
};


export default ManagementContractContext;
