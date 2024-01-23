import React, { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function HappinessMatrix(props) {
  const chartWidth = 800;
  const chartHeight = 800;
  const chartMargin = { top: 20, right: 20, bottom: 20, left: 20 };
  const { data, dataSetter } = props;

  const axisLabelStyle = {
    fontFamily: 'Source Sans Pro',
    color: '#160449',
    fontWeight: 'bold',
  };

  const [clickedIndex, setClickedIndex] = useState(null);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <ResponsiveContainer>
      <ScatterChart
        width={chartWidth}
        height={chartHeight}
        margin={chartMargin}
        onClick={() => setTooltipVisible(!tooltipVisible)}
      >
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey="x"
          name="Delta Cashflow"
          axisLine={false}
          tick={false}
          style={axisLabelStyle}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Vacancies"
          axisLine={false}
          tick={false}
          style={axisLabelStyle}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ payload }) => {
            if (payload && payload.length && tooltipVisible) {
              const dataPoint = payload[0].payload;
              return (
                <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                  <p><strong>Name:</strong> {dataPoint.name}</p>
                  <p><strong>Delta Cashflow:</strong> {dataPoint.x}</p>
                  <p><strong>Vacancies:</strong> {dataPoint.y}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter
          name="A school"
          data={data}
          shape={(props) => (
            <CustomImage
              {...props}
              onClick={() => {
                dataSetter((prev) => ({ ...prev, name: props.payload.name }));
                setClickedIndex(props.payload.index);
                setTooltipVisible(true); // Show the tooltip on click
              }}
              isClicked={props.payload.index === clickedIndex}
            />
          )}
        >
          {/* Render circle outline only for the clicked point */}
          {clickedIndex !== null && (
            <Scatter
              data={[data[clickedIndex]]}
              shape={(props) => (
                <CustomImage
                  {...props}
                  isClicked={true}
                />
              )}
            />
          )}
        </Scatter>
        <ReferenceLine
          y={0}
          stroke="#000000"
          strokeDasharray="3 3"
          label={{
            value: 'Delta Cashflow',
            angle: -90,
            position: 'insideLeft',
            dx: -30,
            dy: 50,
            style: axisLabelStyle,
            fill: '#160449',
          }}
        />
        <ReferenceLine
          x={0}
          stroke="#000000"
          strokeDasharray="3 3"
          label={{
            value: 'Vacancies',
            position: 'insideBottom',
            dy: 30,
            style: axisLabelStyle,
            fill: '#160449',
          }}
        />
        <ReferenceLine
          segment={[{ x: -300, y: -300 }, { x: 300, y: 300 }]}
          stroke="#000000"
          strokeWidth={1}
          ifOverflow="hidden"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );

}

// Inside the CustomImage component
const CustomImage = (props) => {
  const { cx, cy, payload, onClick, isClicked } = props;
  const diameter = 30;

  let quarter;
  if (payload.x < 0 && payload.y < 0) {
    quarter = 1;
  } else if (payload.x > 0 && payload.y < 0) {
    quarter = 2;
  } else if (payload.x < 0 && payload.y > 0) {
    quarter = 3;
  } else if (payload.x > 0 && payload.y > 0) {
    quarter = 4;
  }

  // Set the default borderColor
  let borderColor;
  switch (quarter) {
    case 1:
      borderColor = '#A52A2A';
      break;
    case 2:
      borderColor = '#FF8A00';
      break;
    case 3:
      borderColor = '#FFC85C';
      break;
    case 4:
      borderColor = '#3D5CAC';
      break;
    default:
      borderColor = '#000000';
  }

  // Set the borderColor to blue only for the selected point

  // Define the outline width based on isClicked
  const outlineWidth = isClicked ? 4 : 2;

  return (
    <g onClick={() => onClick(payload.name)}>
      <foreignObject x={cx - diameter / 2} y={cy - diameter / 2} width={diameter} height={diameter}>
        {payload?.photo ? (
          <img
            src={payload.photo}
            alt="scatter-image"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <AccountCircleIcon
            sx={{
              color: borderColor,
              width: '100%',
              height: '100%',
              borderRadius: '50%', // Add border radius to fill the shape
              borderWidth: outlineWidth, // Control the width of the border
              borderStyle: 'solid', // Add border style
            }}
          />
        )}
      </foreignObject>
      {payload?.photo && ( // Display circle outline only if there is a photo
        <circle
          cx={cx}
          cy={cy}
          r={diameter / 2 + outlineWidth / 2}
          fill="none"
          stroke={borderColor}
          strokeWidth={outlineWidth}
        />
      )}
    </g>
  );
};
