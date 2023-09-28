// import { createContext, useState} from "react";

import { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";

const POProfileContext = createContext();

export function useMyContext() {
  return useContext(POProfileContext);
}

export function POProfileContextProvider({ children }) {

  const [owner_user_id, set_owner_user_id] = useState();
  const [owner_first_name, set_owner_first_name] = useState();
  const [owner_last_name, set_owner_last_name] = useState();
  const [owner_phone_number, set_owner_phone_number] = useState();
  const [owner_email, set_owner_email] = useState();
  const [owner_ein_number, set_owner_ein_number] = useState();
  const [owner_ssn, set_owner_ssn] = useState();
  const [owner_address, set_owner_address] = useState();
  const [owner_unit, set_owner_unit] = useState();
  const [owner_city, set_owner_city] = useState();
  const [owner_state, set_owner_state] = useState();
  const [owner_zip, set_owner_zip] = useState();
  const [owner_photo, set_owner_photo] = useState();
  
  const update_owner_user_id = (newData) => { set_owner_user_id(newData); };
	const update_owner_first_name = (newData) => { set_owner_first_name(newData); };
	const update_owner_last_name = (newData) => { set_owner_last_name(newData); };
	const update_owner_phone_number = (newData) => { set_owner_phone_number(newData); };
	const update_owner_email = (newData) => { set_owner_email(newData); };
	const update_owner_ein_number = (newData) => { set_owner_ein_number(newData); };
	const update_owner_ssn = (newData) => { set_owner_ssn(newData); };
	const update_owner_address = (newData) => { set_owner_address(newData); };
	const update_owner_unit = (newData) => { set_owner_unit(newData); };
	const update_owner_city = (newData) => { set_owner_city(newData); };
	const update_owner_state = (newData) => { set_owner_state(newData); };
	const update_owner_zip = (newData) => { set_owner_zip(newData); };
	const update_owner_photo = (newData) => { set_owner_photo(newData); };

    return (
        <POProfileContext.Provider value = {
            {
              owner_user_id, update_owner_user_id,
              owner_first_name, update_owner_first_name,
              owner_last_name, update_owner_last_name,
              owner_phone_number, update_owner_phone_number,
              owner_email, update_owner_email,
              owner_ein_number, update_owner_ein_number,
              owner_ssn, update_owner_ssn,
              owner_address, update_owner_address,
              owner_unit, update_owner_unit,
              owner_city, update_owner_city,
              owner_state, update_owner_state,
              owner_zip, update_owner_zip,
              owner_photo, update_owner_photo,
            }}>
          {children}
        </POProfileContext.Provider>
      );
}

