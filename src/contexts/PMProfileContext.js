// import { createContext, useState} from "react";

import { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";

const PMProfileContext = createContext();

export function useMyContext() {
  return useContext(PMProfileContext);
}

export function PMProfileContextProvider({ children }) {

    const [business_user_id, set_business_user_id] = useState();
    const [business_type, set_business_type] = useState();
    // const [business_first_name, set_business_first_name] = useState();
    // const [business_last_name, set_business_last_name] = useState();
    const [business_photo, set_business_photo] = useState();
    const [business_name, set_business_name] = useState();
    const [business_phone_number, set_business_phone_number] = useState();
    const [business_email, set_business_email] = useState();
    const [business_ein_number, set_business_ein_number] = useState();
    const [business_services_fees, set_business_services_fees] = useState();
    const [business_locations, set_business_locations] = useState();
    const [business_address, set_business_address] = useState();
	  const [business_unit, set_business_unit] = useState();
    const [business_city, set_business_city] = useState();
    const [business_state, set_business_state] = useState();
    const [business_zip, set_business_zip] = useState();
    
	const update_business_user_id = (newData) => { set_business_user_id(newData); };
	const update_business_type = (newData) => { set_business_type(newData); };
	// const update_business_first_name = (newData) => { set_business_first_name(newData); };
	// const update_business_last_name = (newData) => { set_business_last_name(newData); };
	const update_business_photo = (newData) => { set_business_photo(newData); };
	const update_business_name = (newData) => { set_business_name(newData); };
	const update_business_phone_number = (newData) => { set_business_phone_number(newData); };
	const update_business_email = (newData) => { set_business_email(newData); };
	const update_business_ein_number = (newData) => { set_business_ein_number(newData); };
	const update_business_services_fees = (newData) => { set_business_services_fees(newData); };
	const update_business_locations = (newData) => { set_business_locations(newData); };
	const update_business_address = (newData) => { set_business_address(newData); };
	const update_business_unit = (newData) => { set_business_unit(newData); };
	const update_business_city = (newData) => { set_business_city(newData); };
	const update_business_state = (newData) => { set_business_state(newData); };
	const update_business_zip = (newData) => { set_business_zip(newData); };

    return (
        <PMProfileContext.Provider value = {
            {
                business_user_id, update_business_user_id,
                business_type, update_business_type,
                // business_first_name, update_business_first_name,
                // business_last_name, update_business_last_name,
                business_photo, update_business_photo,
                business_name, update_business_name,
                business_phone_number, update_business_phone_number,
                business_email, update_business_email,
                business_ein_number, update_business_ein_number,
                business_services_fees, update_business_services_fees,
                business_locations, update_business_locations,
                business_address, update_business_address,
                business_unit, update_business_unit,
                business_city, update_business_city,
                business_state, update_business_state,
                business_zip, update_business_zip,
            }}>
          {children}
        </PMProfileContext.Provider>
      );
}

