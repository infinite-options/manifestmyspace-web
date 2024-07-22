import React from 'react';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const StaticMap = ({ address, latitude, longitude, zoom = 15, size = '600x300', mapType = 'roadmap' }) => {
  let mapUrl = `https://maps.googleapis.com/maps/api/staticmap?key=${GOOGLE_API_KEY}&zoom=${zoom}&size=${size}&maptype=${mapType}`;

  if (address) {
    mapUrl += `&center=${encodeURIComponent(address)}`;
  } else if (latitude && longitude) {
    mapUrl += `&center=${latitude},${longitude}`;
  } else {
    return <div>Error: No address or coordinates provided</div>;
  }

  // Add marker to the URL
  if (latitude && longitude) {
    mapUrl += `&markers=color:red%7C${latitude},${longitude}`;
  }

  return (
    <div>
      <img src={mapUrl} alt="Static Map" style={{ width: '100%', borderRadius: '5px' }} />
    </div>
  );
};

export default StaticMap;
