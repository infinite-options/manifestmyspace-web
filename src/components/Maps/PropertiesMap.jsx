import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Typography } from '@material-ui/core';
import defaultHouseImage from "../Property/defaultHouseImage.png";

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '5px',
  
};

const center = {
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

const PropertiesMap = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = React.useState(null);  

  return (
    <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} options={{ styles: mapStyles }}>
      {properties.map((property, idx) => {
          const latitude = parseFloat(property.property_latitude);
          const longitude = parseFloat(property.property_longitude);

          if (!isNaN(latitude) && !isNaN(longitude)) {
            console.log("ROHIT - property.property_latitude - ", parseFloat(property.property_latitude));
            console.log("ROHIT - property.property_longitude - ", parseFloat(property.property_longitude));
            
            return (            
              <Marker
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
            position={{ lat: parseFloat(selectedProperty.property_latitude), lng: parseFloat(selectedProperty.property_longitude) }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div>
              <Typography variant="h6">
                {selectedProperty.property_address}, Unit {selectedProperty.property_unit},
              </Typography>
              <Typography variant="h6">
                {selectedProperty.property_city}, {selectedProperty.property_state} {selectedProperty.property_zip}
              </Typography>
              <img 
                src={selectedProperty.property_favorite_image || defaultHouseImage} 
                alt={selectedProperty.name} 
                style={{ width: '100px', height: '100px',}}
              />                
              
                          
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default PropertiesMap;
