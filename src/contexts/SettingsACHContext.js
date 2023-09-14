// import { createContext, useState} from "react";

import { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";

//const SettingsACHContext = createContext();
const SettingsACHContext = createContext();

export function useMyContext() {
  return useContext(SettingsACHContext);
}

// const SettingsACHContextProvider = ({ children }) => {

export function SettingsACHContextProvider({ children }) {

    const [account_business_id, set_account_business_id] = useState();
    const [account_business_legal_name, set_account_business_legal_name] = useState();
    const [account_business_name, set_business_name] = useState();
    const [account_business_website, set_account_business_website] = useState();
    const [account_business_phone, set_account_business_phone] = useState();
    const [account_business_type, set_account_business_type] = useState();
    const [account_business_ownership_type, set_account_business_ownership_type] = useState();
    const [account_business_incorporation_date, set_account_business_incorporation_date] = useState();
    const [account_business_tax_id, set_account_business_tax_id] = useState();
    const [account_business_address, set_account_business_address] = useState();
    const [account_business_city, set_account_business_city] = useState();
    const [account_business_state, set_account_business_state] = useState();
    const [account_business_zip, set_account_business_zip] = useState();
    const [account_business_country, set_account_business_country] = useState();
    
    const [account_principal_first_name, set_account_principal_first_name] = useState();
    const [account_principal_last_name, set_account_principal_last_name] = useState();
    const [account_principal_title, set_account_principal_title] = useState();
    const [account_principal_birth_date, set_account_principal_birth_date] = useState();
    const [account_principal_ownership_percentage, set_account_principal_ownership_percentage] = useState();
    const [account_principal_phone, set_account_principal_phone] = useState();
    const [account_principal_ssn, set_account_principal_ssn] = useState();
    const [account_principal_address, set_account_principal_address] = useState();
    const [account_principal_city, set_account_principal_city] = useState();
    const [account_principal_state, set_account_principal_state] = useState();
    const [account_principal_zip, set_account_principal_zip] = useState();
    const [account_principal_country, set_account_principal_country] = useState();
    const [account_principal_email, set_account_principal_email] = useState();
    const [account_annual_card_volume, set_account_annual_card_volume] = useState();
    const [account_merchant_category_code, set_account_merchant_category_code] = useState();
    const [account_default_statement_descriptor, set_account_default_statement_descriptor] = useState();
    const [account_max_card_transaction_amount, set_account_max_card_transaction_amount] = useState();
    const [account_max_ach_transaction_amount, set_account_max_ach_transaction_amount] = useState();
    const [account_business_description, set_account_business_description] = useState();
    const [account_average_card_transaction_amount, set_account_average_card_transaction_amount] = useState();
    const [account_average_echeck_transaction_amount, set_account_average_echeck_transaction_amount] = useState();
    const [account_annual_ach_volume, set_account_annual_ach_volume] = useState();
    const [account_refund_policy, set_account_refund_policy] = useState();
    const [account_btb_volume_percentage, set_account_btb_volume_percentage] = useState();
    const [account_btc_volume_percentage, set_account_btc_volume_percentage] = useState();
    const [account_other_volume, set_account_other_volume] = useState();
    const [account_card_present_percentage, set_account_card_present_percentage] = useState();
    const [account_ecommerce_percentage, set_account_ecommerce_percentage] = useState();
    const [account_mail_tele_order_percentage, set_account_mail_tele_order_percentage] = useState();
    const [account_name, set_account_name] = useState();
    const [account_routing_number, set_account_routing_number] = useState();
    const [account_number, set_account_number] = useState();
    const [account_type, set_account_type] = useState();

    const update_account_business_id = (newData) => { set_account_business_id(newData); };
    const update_account_business_legal_name = (newData) => { set_account_business_legal_name(newData); };
    const update_account_business_name = (newData) => { set_business_name(newData); };
    const update_account_business_website = (newData) => { set_account_business_website(newData); };
    const update_account_business_phone = (newData) => { set_account_business_phone(newData); };
    const update_account_business_type = (newData) => { set_account_business_type(newData); };
    const update_account_business_ownership_type = (newData) => { set_account_business_ownership_type(newData); };
    const update_account_business_incorporation_date = (newData) => { set_account_business_incorporation_date(newData); };
    const update_account_business_tax_id = (newData) => { set_account_business_tax_id(newData); };
    const update_account_business_address = (newData) => { set_account_business_address(newData); };
    const update_account_business_city = (newData) => { set_account_business_city(newData); };
    const update_account_business_state = (newData) => { set_account_business_state(newData); };
    const update_account_business_zip = (newData) => { set_account_business_zip(newData); };
    const update_account_business_country = (newData) => { set_account_business_country(newData); };
    
    const update_account_principal_first_name = (newData) => { set_account_principal_first_name(newData); };
    const update_account_principal_last_name = (newData) => { set_account_principal_last_name(newData); };
    const update_account_principal_title = (newData) => { set_account_principal_title(newData); };
    const update_account_principal_birth_date = (newData) => { set_account_principal_birth_date(newData); };
    const update_account_principal_ownership_percentage = (newData) => { set_account_principal_ownership_percentage(newData); };
    const update_account_principal_phone = (newData) => { set_account_principal_phone(newData); };
    const update_account_principal_ssn = (newData) => { set_account_principal_ssn(newData); };
    const update_account_principal_address = (newData) => { set_account_principal_address(newData); };
    const update_account_principal_city = (newData) => { set_account_principal_city(newData); };
    const update_account_principal_state = (newData) => { set_account_principal_state(newData); };
    const update_account_principal_zip = (newData) => { set_account_principal_zip(newData); };
    const update_account_principal_country = (newData) => { set_account_principal_country(newData); };
    const update_account_principal_email = (newData) => { set_account_principal_email(newData); };
    const update_account_annual_card_volume = (newData) => { set_account_annual_card_volume(newData); };
    const update_account_merchant_category_code = (newData) => { set_account_merchant_category_code(newData); };
    const update_account_default_statement_descriptor = (newData) => { set_account_default_statement_descriptor(newData); };
    const update_account_max_card_transaction_amount = (newData) => { set_account_max_card_transaction_amount(newData); };
    const update_account_max_ach_transaction_amount = (newData) => { set_account_max_ach_transaction_amount(newData); };
    const update_account_business_description = (newData) => { set_account_business_description(newData); };
    const update_account_average_card_transaction_amount = (newData) => { set_account_average_card_transaction_amount(newData); };
    const update_account_average_echeck_transaction_amount = (newData) => { set_account_average_echeck_transaction_amount(newData); };
    const update_account_annual_ach_volume = (newData) => { set_account_annual_ach_volume(newData); };
    const update_account_refund_policy = (newData) => { set_account_refund_policy(newData); };
    const update_account_btb_volume_percentage = (newData) => { set_account_btb_volume_percentage(newData); };
    const update_account_btc_volume_percentage = (newData) => { set_account_btc_volume_percentage(newData); };
    const update_account_other_volume = (newData) => { set_account_other_volume(newData); };
    const update_account_card_present_percentage = (newData) => { set_account_card_present_percentage(newData); };
    const update_account_ecommerce_percentage = (newData) => { set_account_ecommerce_percentage(newData); };
    const update_account_mail_tele_order_percentage = (newData) => { set_account_mail_tele_order_percentage(newData); };
    const update_account_name = (newData) => { set_account_name(newData); };
    const update_account_routing_number = (newData) => { set_account_routing_number(newData); };
    const update_account_number = (newData) => { set_account_number(newData); };
    const update_account_type = (newData) => { set_account_type(newData); };

    return (
        <SettingsACHContext.Provider value = {
            {
                account_business_id, update_account_business_id,
                account_business_legal_name, update_account_business_legal_name,
                account_business_name, update_account_business_name,
                account_business_website, update_account_business_website,
                account_business_phone, update_account_business_phone,
                account_business_type, update_account_business_type,
                account_business_ownership_type, update_account_business_ownership_type,
                account_business_incorporation_date, update_account_business_incorporation_date,
                account_business_tax_id, update_account_business_tax_id,
                account_business_address, update_account_business_address,
                account_business_city, update_account_business_city,
                account_business_state, update_account_business_state,
                account_business_zip, update_account_business_zip,
                account_business_country, update_account_business_country,
                
                account_principal_first_name, update_account_principal_first_name,
                account_principal_last_name, update_account_principal_last_name,
                account_principal_title, update_account_principal_title,
                account_principal_birth_date, update_account_principal_birth_date,
                account_principal_ownership_percentage, update_account_principal_ownership_percentage,
                account_principal_phone, update_account_principal_phone,
                account_principal_ssn, update_account_principal_ssn,
                account_principal_address, update_account_principal_address,
                account_principal_city, update_account_principal_city,
                account_principal_state, update_account_principal_state,
                account_principal_zip, update_account_principal_zip,
                account_principal_country, update_account_principal_country,
                account_principal_email, update_account_principal_email,
                
                account_annual_card_volume, update_account_annual_card_volume,
                account_merchant_category_code, update_account_merchant_category_code,
                account_default_statement_descriptor, update_account_default_statement_descriptor,
                account_max_card_transaction_amount, update_account_max_card_transaction_amount,
                account_max_ach_transaction_amount, update_account_max_ach_transaction_amount,
                
                account_business_description, update_account_business_description,
                account_average_card_transaction_amount, update_account_average_card_transaction_amount,
                account_average_echeck_transaction_amount, update_account_average_echeck_transaction_amount,
                account_annual_ach_volume, update_account_annual_ach_volume,
                account_refund_policy, update_account_refund_policy,
                account_btb_volume_percentage, update_account_btb_volume_percentage,
                account_btc_volume_percentage, update_account_btc_volume_percentage,
                account_other_volume, update_account_other_volume,
                account_card_present_percentage, update_account_card_present_percentage,
                account_ecommerce_percentage, update_account_ecommerce_percentage,
                account_mail_tele_order_percentage, update_account_mail_tele_order_percentage,
               
                account_name, update_account_name,
                account_routing_number, update_account_routing_number,
                account_number, update_account_number,
                account_type, update_account_type,
            }}>
          {children}
        </SettingsACHContext.Provider>
      );
}

