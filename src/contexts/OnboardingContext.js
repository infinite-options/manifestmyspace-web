import { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";

const OnboardingContext = createContext();

export function useOnboardingContext() {
  return useContext(OnboardingContext);
}

export function OnboardingProvider({ children }) {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [photo, setPhoto] = useState();
  const [businessName, setBusinessName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [email, setEmail] = useState();
  const [ein, setEin] = useState();
  const [ssn, setSsn] = useState("");
  const [mask, setMask] = useState("");
  // const [fees, setFees] = useState();
  // const [locations, setLocations] = useState();
  const [address, setAddress] = useState();
  const [unit, setUnit] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [zip, setZip] = useState();
  return (
    <OnboardingContext.Provider
      value={{
        firstName,
        setFirstName,
        lastName,
        setLastName,
        photo,
        setPhoto,
        businessName,
        setBusinessName,
        phoneNumber,
        setPhoneNumber,
        email,
        setEmail,
        ein,
        setEin,
        ssn,
        setSsn,
        mask,
        setMask,
        // fees,
        // setFees,
        // locations,
        // setLocations,
        address,
        setAddress,
        unit,
        setUnit,
        city,
        setCity,
        state,
        setState,
        zip,
        setZip,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
