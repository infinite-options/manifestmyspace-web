import React, { useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useUser } from "../../contexts/UserContext";

const OwnerList = () => {
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
  let [matrixData, setMatrixData] = useState([]);
  const [clickedColor, setClickedColor] = useState(null);

  useEffect(() => {
    const fetchMatrixData = async () => {
      const response = await fetch(
        `https://l0h6a9zi1e.execute-api.us-west-1.amazonaws.com/dev/happinessMatrix/${getProfileId()}`
      );
      const jsonData = await response.json();

      // Transforming the data
      const transformedData = jsonData.vacancy.result.map((vacancyItem, i) => {
        const deltaCashflowItem = jsonData.delta_cashflow.result.find(
          (item) => item.owner_id === vacancyItem.owner_uid
        );
        const fullName = `${deltaCashflowItem.owner_first_name} ${deltaCashflowItem.owner_last_name}`;

        let quarter;
        if (
          deltaCashflowItem.delta_cashflow_perc < 0 &&
          vacancyItem.vacancy_perc < 0
        ) {
          quarter = 1;
        } else if (
          deltaCashflowItem.delta_cashflow_perc > 0 &&
          vacancyItem.vacancy_perc < 0
        ) {
          quarter = 2;
        } else if (
          deltaCashflowItem.delta_cashflow_perc < 0 &&
          vacancyItem.vacancy_perc > 0
        ) {
          quarter = 3;
        } else if (
          deltaCashflowItem.delta_cashflow_perc > 0 &&
          vacancyItem.vacancy_perc > 0
        ) {
          quarter = 4;
        }

        let borderColor;
        switch (quarter) {
          case 1:
            borderColor = "#A52A2A"; // Red color
            break;
          case 2:
            borderColor = "#FF8A00"; // Orange color
            break;
          case 3:
            borderColor = "#FFC85C"; // Yellow color
            break;
          case 4:
            borderColor = "#3D5CAC"; // Blue color
            break;
          default:
            borderColor = "#000000"; // Black color
        }

        return {
          name: fullName.trim(),
          photo: deltaCashflowItem.owner_photo_url,
          vacancy_perc: parseFloat(vacancyItem.vacancy_perc).toFixed(2),
          delta_cashflow_perc: deltaCashflowItem.delta_cashflow_perc || 0,
          vacancy_num: vacancyItem.vacancy_num || 0,
          cashflow: deltaCashflowItem.cashflow || 0,
          expected_cashflow: deltaCashflowItem.expected_cashflow || 0,
          delta_cashflow:
            deltaCashflowItem.cashflow - deltaCashflowItem.expected_cashflow,
          index: i,
          color: borderColor,
          total_properties: vacancyItem.total_properties || 0,
        };
      });

      // Sorting transformedData based on the color
      const sortedData = transformedData.sort((a, b) => {
        const colorOrder = {
          "#A52A2A": 1, "#FF8A00": 2, "#FFC85C": 3, "#3D5CAC": 4, "#000000": 5,};
        return colorOrder[a.color] - colorOrder[b.color];
      });

      setMatrixData(sortedData);
    };

    fetchMatrixData();
  }, []);

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
