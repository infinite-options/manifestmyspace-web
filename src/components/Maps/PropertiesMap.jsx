import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api';
import { Typography } from '@material-ui/core';
import defaultHouseImage from "../Property/defaultHouseImage.png";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '5px',
};

const defaultCenter = {
  lat: 37.3382,
  lng: -121.8863,
};

const mapStyles = [
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];

const libraries = ['places'];

const PropertiesMap = ({ properties, mapCenter }) => {
  const [selectedProperty, setSelectedProperty] = React.useState(null);

  // console.log("PropertiesMap - properties - ", properties)
  // const libs = ['places']
  // console.log("PropertiesMap - mapCenter - ", mapCenter)
  const [ libraries ] = useState(['places']);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
    // libraries: ['places'],
    // libs
    libraries,
  });

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter? mapCenter : defaultCenter}
      zoom={10}
      options={{ styles: mapStyles }}
    >
      {properties.map((property, idx) => {
        const latitude = parseFloat(property.property_latitude);
        const longitude = parseFloat(property.property_longitude);
        console.log("property.property_latitude - ", parseFloat(property.property_latitude));
        console.log("property.property_longitude - ", parseFloat(property.property_longitude));


        if (!isNaN(latitude) && !isNaN(longitude)) {
          return (
            <MarkerF
              key={idx}
              position={{ lat: latitude, lng: longitude }}
              onClick={() => setSelectedProperty(property)}
            />
          );
        }
        return null;
      })}

      {selectedProperty && (
        <InfoWindow
          position={{
            lat: parseFloat(selectedProperty.property_latitude),
            lng: parseFloat(selectedProperty.property_longitude),
          }}
          onCloseClick={() => setSelectedProperty(null)}
        >
          <div>
            <Typography variant="h6">
              {selectedProperty.property_address}, Unit {selectedProperty.property_unit}
            </Typography>
            <Typography variant="h6">
              {selectedProperty.property_city}, {selectedProperty.property_state}{' '}
              {selectedProperty.property_zip}
            </Typography>
            <img
              src={selectedProperty.property_favorite_image || defaultHouseImage}
              alt={selectedProperty.name}
              style={{ width: '100px', height: '100px' }}
            />
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default PropertiesMap;
