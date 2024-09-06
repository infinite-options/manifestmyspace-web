import React, { createContext, useState, useEffect } from 'react';
import APIConfig from '../utils/APIConfig';
import { useUser } from './UserContext';
const PropertiesContext = createContext();

function getPropertyList(data) {
    const propertyList = data["Property"]?.result;
    const applications = data["Applications"]?.result;
    const maintenance = data["MaintenanceRequests"]?.result;

    const appsMap = new Map();
    applications.forEach((a) => {
        const appsByProperty = appsMap.get(a.property_uid) || [];
        appsByProperty.push(a);
        appsMap.set(a.property_uid, appsByProperty);
    });

    const maintMap = new Map();
    if (maintenance) {
        maintenance.forEach((m) => {
        const maintByProperty = maintMap.get(m.maintenance_property_id) || [];
        maintByProperty.push(m);
        maintMap.set(m.maintenance_property_id, maintByProperty);
        });
    }

    //   console.log(maintMap);
    return propertyList.map((p) => {
        p.applications = appsMap.get(p.property_uid) || [];
        p.applicationsCount = [...p.applications].filter((a) => ["NEW", "PROCESSING"].includes(a.lease_status)).length;
        p.maintenance = maintMap.get(p.property_uid) || [];
        p.maintenanceCount = [...p.maintenance].filter((m) => m.maintenance_request_status === "NEW" || m.maintenance_request_status === "PROCESSING").length;
        // p.newContracts = contractsMap.get(p.property_uid) || [];
        // p.newContractsCount = [...p.newContracts].filter((m) => m.contract_status === "NEW").length;
        return p;
    });
}


export const PropertiesProvider = ({ children }) => {
  const { getProfileId } = useUser();
  const [ dataLoaded, setDataLoaded ] = useState(false);
  const [ properties, setProperties ] = useState([]);
  const [ contracts, setContracts ] = useState([]);
  const [ dataReady, setDataReady ] = useState(false);
  
  const fetchProperties = async () => {        
    const property_response = await fetch(`${APIConfig.baseURL.dev}/properties/${getProfileId()}`);
    //const response = await fetch(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/properties/110-000003`)
    if (!property_response.ok) {
      console.error("Error fetching Property Details data");
    }
    const propertyData = await property_response.json();
    const propertyList = getPropertyList(propertyData); // This combines Properties with Applications and Maitenance Items to enable the LHS screen
    // console.log("In Properties > Property Endpoint: ", propertyList);
    
    // setRawPropertyData(propertyData); // Sets rawPropertyData to be based into Edit Properties Function
    // setPropertyList([...propertyList]);
    // setDisplayedItems([...propertyList]);
    // setPropertyIndex(0);

    setProperties(propertyList)

    if (propertyData.Property.code === 200) {
      // console.log("Endpoint Data is Ready");
      setDataReady(true);
    }    
  };

  useEffect(() => {
    if (!dataLoaded) {
      setDataLoaded(true);      
      
      fetchProperties();
    }
  }, [dataLoaded]);

  return (
    <PropertiesContext.Provider 
      value={{ 
        properties,
        fetchProperties, // refresh properties
        dataLoaded, 
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};


export default PropertiesContext;
