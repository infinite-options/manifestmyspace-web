import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function SelectProperty(props) {
  const handleClose = props.closeTab;
  const { getProfileId } = useUser();
  let setSelectedProperty = {};
  if (props.setSelectedProperty) {
    setSelectedProperty = props.setSelectedProperty;
  }
  const [properties, setProperties] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    setShowSpinner(true);
    axios.get(`https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/propertiesByOwner/${getProfileId()}`).then((res) => {
      console.log("Property list ", res.data.Property.result);
      setProperties(res.data.Property.result);
      setShowSpinner(false);
    });
  }, []);

  return (
    <Box
      sx={{
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        padding: "5px",
        paddingLeft: "20px",
        paddingRight: "20px",
        minWidth: "320px",
      }}
    >
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={showSpinner}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "15px",
            height: "15px",
          }}
        ></Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.49421 10.97C5.20831 11.6165 5.20831 12.3519 5.20831 13.8228V18.4166C5.20831 20.4594 5.20831 21.4807 5.81851 22.1153C6.37692 22.6961 7.2468 22.7454 8.89581 22.7495V17.3333C8.89581 16.2201 9.77329 15.25 10.9375 15.25H14.0625C15.2267 15.25 16.1041 16.2201 16.1041 17.3333V22.7495C17.7532 22.7454 18.623 22.6961 19.1815 22.1153C19.7916 21.4807 19.7916 20.4594 19.7916 18.4166V13.8228C19.7916 12.3519 19.7916 11.6165 19.5057 10.97C19.2199 10.3236 18.6829 9.84493 17.6091 8.88768L16.5674 7.9591C14.6265 6.22888 13.656 5.36377 12.5 5.36377C11.344 5.36377 10.3735 6.22888 8.43253 7.9591L7.39087 8.88768C6.31703 9.84493 5.78011 10.3236 5.49421 10.97ZM14.1041 22.7499V17.3333C14.1041 17.2974 14.091 17.2737 14.0782 17.2604C14.0719 17.2538 14.0669 17.2512 14.0653 17.2505L14.0651 17.2504C14.0644 17.2501 14.0642 17.25 14.0625 17.25H10.9375C10.9358 17.25 10.9355 17.2501 10.9348 17.2504L10.9347 17.2505C10.933 17.2512 10.9281 17.2538 10.9217 17.2604C10.909 17.2737 10.8958 17.2974 10.8958 17.3333V22.7499H14.1041Z"
                fill="#3D5CAC"
              />
            </svg>
          </Box>
          <Box
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#3D5CAC",
            }}
          >
            Select Property
          </Box>
        </Box>
        <Box onClick={() => handleClose()}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <path d="M11.25 3.75L3.75 11.25" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
            <path d="M3.75 3.75L11.25 11.25" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
          </svg>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#3D5CAC19",
          color: "#3D5CAC",
          borderRadius: "20px",
          padding: "5px",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <Box
          sx={{
            fontSize: "14px",
            marginRight: "10px",
          }}
        >
          Search by location, tenant, type, status
        </Box>
        <Box>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <circle cx="10.0834" cy="10.0833" r="6.41667" stroke="#3D5CAC" strokeWidth="2" />
            <path
              d="M10.0833 7.33333C9.72218 7.33333 9.36458 7.40446 9.03093 7.54266C8.69729 7.68086 8.39413 7.88342 8.13877 8.13878C7.88341 8.39415 7.68084 8.6973 7.54264 9.03095C7.40444 9.36459 7.33331 9.72219 7.33331 10.0833"
              stroke="#3D5CAC"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path d="M18.3333 18.3333L15.5833 15.5833" stroke="#3D5CAC" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F2F2F2",
          padding: "10px",
          marginTop: "15px",
          color: "#160449",
          fontSize: "15px",
          fontWeight: "600",
        }}
        onClick={() => {
          setSelectedProperty({});
          console.log("selectedProperty set to blank");
        }}
      >
        Show All
      </Box>
      {properties && properties.map((property, i) => <PropertyCard key={i} data={property} setSelectedProperty={setSelectedProperty || null} />)}
    </Box>
  );
}

function PropertyCard(props) {
  const [selected, setSelected] = useState({});
  const property = props.data;
  let setSelectedProperty = {};
  if (props.setSelectedProperty) {
    setSelectedProperty = props.setSelectedProperty;
  }

  function parseImageData(data) {
    const s = data.indexOf("http");
    const l = data.indexOf('"', s);
    const imageString = data.slice(s, l);
    return imageString;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        backgroundColor: selected === property ? "#3D5CAC" : "#F2F2F2",
        marginTop: "7px",
        height: "40px",
      }}
      onClick={() => {
        console.log("property selected ", property);
        setSelected(property);
        setSelectedProperty && setSelectedProperty(property);
      }}
    >
      <Box
        sx={{
          marginLeft: "0px",
          marginRight: "10px",
        }}
      >
        <img
          src={parseImageData(property.property_images)}
          alt="Property Img"
          style={{
            width: "40px",
            height: "40px",
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#160449",
          fontWeight: "600",
          fontSize: "15px",
        }}
      >
        {property.property_unit ? `${property.property_address}, ${property.property_unit}` : property.property_address}
      </Box>
    </Box>
  );
}
export default SelectProperty;
