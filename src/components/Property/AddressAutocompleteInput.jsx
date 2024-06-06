import React, { useState, useRef, useCallback } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const AddressAutocompleteInput = ({ onAddressSelect, defaultValue, gray }) => {
  // const [address, setAddress] = useState('');

  const autocomplete = useRef(null);

  const extractAddress = (components) => {
    const address = {
      street: '',      
      city: '',
      state: '',
      zip: '',
    };

    components.forEach(component => {
      const types = component.types;
      if (types.includes('street_number')) {
        address.street = `${component.long_name} `;
      }
      if (types.includes('route')) {
        address.street += component.long_name;
      }
      if (types.includes('locality')) {
        address.city = component.long_name;
      }
      if (types.includes('administrative_area_level_1')) {
        address.state = component.short_name;
      }
      if (types.includes('postal_code')) {
        address.zip = component.long_name;
      }
    });

    console.log("extractAddress - address - ", address);

    return address;
  };

  const onPlaceChanged = useCallback(() => {
    if (autocomplete.current) {
      const place = autocomplete.current.getPlace();
      if (place && place.address_components) {
        const addressComponents = place.address_components;
        const address = extractAddress(addressComponents);
        onAddressSelect(address);
      }
    }
  }, [onAddressSelect]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY} libraries={libraries} loading="async">      
      <Autocomplete
        onLoad={auto => { autocomplete.current = auto; }}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ['address'],
          componentRestrictions: { country: 'us' }, // Restrict search to the US          
        }}
      >
        {gray ?<input
          type="text"
          // placeholder={placeholder}
          defaultValue={defaultValue? defaultValue : ""}
          style={{
          backgroundColor: "#D6D5DA",
        borderRadius: 10, height: 30, marginBlock: 10, width:'100%', paddingBottom: "5px", outline:'none', border:'none'}}
          onKeyDown={handleKeyDown}
        /> : <input
          type="text"
          // placeholder={placeholder}
          defaultValue={defaultValue? defaultValue : ""}
          style={{ boxSizing: 'border-box', border: '1px solid transparent', width: '100%', height: '40px', padding: '0 12px', borderRadius: '3px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)', fontSize: '14px', outline: 'none', textOverflow: 'ellipses' }}
          onKeyDown={handleKeyDown}
        />
        }
      </Autocomplete>
      {/* <p>DEBUG - Selected Address: {address}</p> */}
    </LoadScript>
  );
};

export default AddressAutocompleteInput;
