import React, { useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useUser } from "../../contexts/UserContext";

const OwnerList = (props) => {
  const nodeRadius = 20;
  const spaceBetweenPoints = 20;
  const lineStyle = {
    stroke: "#160449",
    strokeWidth: 4,
  };

  const arrowStyle = {
    stroke: "none",
    markerEnd: "url(#arrow)",
  };

  const navigate = useNavigate(); // Initialize useNavigate
  const { user, getProfileId } = useUser();
  const [clickedColor, setClickedColor] = useState(null);
  let {matrixData}=props;

  const handlePointClick = (color, index) => {
    setClickedColor(color);

    // Use navigate to navigate to the specified route
    navigate("/managerDashboardHappinessMatrix", {
      state: { matrixData, clicked_index: index },
    });
  };

  return (
    <div>
      <svg 
        width="100%"
        height="100"
        viewBox={`0 0 ${
          matrixData.length * (2 * nodeRadius + spaceBetweenPoints) +
          nodeRadius * 2
        } 100`}
      >
        <defs>
          <marker id="arrow" viewBox="0 0 15 15" refX="12" refY="7.5" markerWidth="13" markerHeight="13" orient="auto">
            <path d="M 0 0 L 15 7.5 L 0 15 z" fill="#160449" />
          </marker>

          {/* Define a circular clipping path */}
          <clipPath id="circleClip">
            <circle cx="0" cy="0" r={nodeRadius} />
          </clipPath>
        </defs>

        <line
          x1={nodeRadius}
          y1="50"
          x2={
            matrixData.length * (2 * nodeRadius + spaceBetweenPoints) +
            nodeRadius
          }
          y2="50"
          style={lineStyle}
        />

        <line
          x1={
            matrixData.length * (2 * nodeRadius + spaceBetweenPoints) +
            nodeRadius
          }
          y1="50"
          x2={
            matrixData.length * (2 * nodeRadius + spaceBetweenPoints) +
            nodeRadius +
            1
          }
          y2="50"
          style={arrowStyle}
        />

        {matrixData.map((node, index) => (
          <g
            key={index}
            transform={`translate(${
              index * (2 * nodeRadius + spaceBetweenPoints) + nodeRadius
            }, 50)`}
          >
            {index < matrixData.length - 1 && (
              <line
                x1={nodeRadius}
                y1="0"
                x2={2 * nodeRadius + spaceBetweenPoints}
                y2="0"
                style={lineStyle}
              />
            )}
            {/* Circle for the outline */}
            <circle
              cx="0" // Center the circle
              cy="0" // Center the circle
              r={nodeRadius + 2} // Adjust the radius to create an outline
              fill={node.color} // Use the same color as the node
            />
            {/* Wrap the entire node with an anchor element */}
            <a
              onClick={() => handlePointClick(node.color, index)}
              style={{ cursor: "pointer" }}
            >
              {/* Use the circular clipping path */}
              <image
                x="-20" // Adjust the positioning as needed
                y="-20" // Adjust the positioning as needed
                width="40" // Adjust the size as needed
                height="40" // Adjust the size as needed
                href={node.photo} // Assuming node.photo contains the URL of the image
                clipPath="url(#circleClip)"
                preserveAspectRatio="xMidYMid slice" // Add this line to preserve aspect ratio
              />
            </a>
          </g>
        ))}
      </svg>
      {clickedColor && <p>Clicked point color: {clickedColor}</p>}
    </div>
  );
};

export default OwnerList;
