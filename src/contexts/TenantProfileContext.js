import { useContext, createContext, useState } from "react";

const TenantProfileContext = createContext();

export function useMyContext() {
  return useContext(TenantProfileContext);
}

export function TenantProfileContextProvider({ children }) {

    const [tenant_user_id, set_tenant_user_id] = useState();
    const [tenant_first_name, set_tenant_first_name] = useState();
    const [tenant_last_name, set_tenant_last_name] = useState();
    const [tenant_email, set_tenant_email] = useState();
    const [tenant_phone_number, set_tenant_phone_number] = useState();
    const [tenant_ssn, set_tenant_ssn] = useState();
    const [masked_ssn, set_masked_ssn] = useState();
    const [tenant_address, set_tenant_address] = useState();
    const [tenant_unit, set_tenant_unit] = useState();
    const [tenant_city, set_tenant_city] = useState();
    const [tenant_state, set_tenant_state] = useState();
    const [tenant_zip, set_tenant_zip] = useState();
    const [tenant_photo, set_tenant_photo] = useState();
  
    const update_tenant_user_id = (newData) => { set_tenant_user_id(newData); };
    const update_tenant_first_name = (newData) => { set_tenant_first_name(newData); };
    const update_tenant_last_name = (newData) => { set_tenant_last_name(newData); };
    const update_tenant_email = (newData) => { set_tenant_email(newData); };
    const update_tenant_phone_number = (newData) => { set_tenant_phone_number(newData); };
    const update_tenant_ssn = (newData) => { set_tenant_ssn(newData); };
    const update_masked_ssn = (newData) => { set_masked_ssn(newData); };
    const update_tenant_address = (newData) => { set_tenant_address(newData); };
    const update_tenant_unit = (newData) => { set_tenant_unit(newData); };
    const update_tenant_city = (newData) => { set_tenant_city(newData); };
    const update_tenant_state = (newData) => { set_tenant_state(newData); };
    const update_tenant_zip = (newData) => { set_tenant_zip(newData); };
    const update_tenant_photo = (newData) => { set_tenant_photo(newData); };

    return (
        <TenantProfileContext.Provider value = {
            {
              tenant_user_id, update_tenant_user_id,
              tenant_first_name, update_tenant_first_name,
              tenant_last_name, update_tenant_last_name,
              tenant_email, update_tenant_email,
              tenant_phone_number, update_tenant_phone_number,
              tenant_ssn, update_tenant_ssn,
              masked_ssn, update_masked_ssn,
              tenant_address, update_tenant_address,
              tenant_unit, update_tenant_unit,
              tenant_city, update_tenant_city,
              tenant_state, update_tenant_state,
              tenant_zip, update_tenant_zip,
              tenant_photo, update_tenant_photo,
            }}>
            {children}
        </TenantProfileContext.Provider>
    );
}
