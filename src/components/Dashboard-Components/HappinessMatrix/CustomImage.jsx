// CustomImage Widget

import React, { useState, useEffect } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Box, ThemeProvider, Grid, List, ListItem, Typography, Paper } from "@mui/material";
import theme from "../../../theme/theme";
import { useNavigate } from "react-router-dom";

function CustomImage(props) {
  const navigate = useNavigate();
  const { cx, cy, payload, onClick, isClicked, isVisible, contactDetails, happinessData } = props;
  const [isClickedState, setIsClickedState] = useState(isClicked);

  //   console.log("In Custom Image Props: ", props);
  //   console.log("In Custom Image Cx Cy: ", cx, cy);
  //   console.log("In Custom Image payload: ", payload);

  if (!isVisible) {
    return null;
  }

  const diameter = 30;
  const outlineWidth = isClicked ? 4 : 2;

  const handleClick = (payload) => {
    // console.log("input to  handleClick: ", payload);
    setIsClickedState(true);
    // console.log("CustomImage - handeClick");
    if (onClick) {
      onClick(payload); // Call the passed onClick function
    }
    // console.log("CustomImage - handleClick - payload - ", payload);
    // if (page === "OwnerContactDetails") {
    //   const idx = contactDetails.findIndex((contact) => contact.owner_uid === payload?.owner_uid);
    //   setIndex(idx);
    //   return;
    // }

    navigate(`/ownerContactDetailsHappinessMatrix`, {
      state: {
        ownerUID: payload.owner_uid,
        navigatingFrom: "HappinessMatrixWidget",
        // index: index,
        happinessData: happinessData,
      },
    });
  };

  return (
    // <g onClick={() => onClick(payload.name)}>
    <g onClick={() => handleClick(payload)}>
      <foreignObject x={cx - diameter / 2} y={cy - diameter / 2} width={diameter} height={diameter}>
        {![null, undefined, ""].includes(payload?.photo) ? (
          <img
            src={payload.photo}
            alt='scatter-image'
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", filter: isClickedState ? "brightness(0.7)" : "none" }}
          />
        ) : (
          <AccountCircleIcon
            sx={{
              color: payload.color,
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              borderWidth: outlineWidth,
              borderStyle: "solid",
              filter: isClickedState ? "brightness(0.7)" : "none",
            }}
          />
        )}
      </foreignObject>
      {payload?.photo && <circle cx={cx} cy={cy} r={diameter / 2 + outlineWidth / 2} fill='none' stroke={payload.color} strokeWidth={outlineWidth} />}
    </g>
  );
}

export default CustomImage;
