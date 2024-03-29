import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function HappinessMatrix(props) {
  const chartWidth = 400;
  const chartHeight = 400;
  const chartMargin = { top: 20, right: 20, bottom: 60, left: 120 };
  const { data, dataSetter } = props;
  let [shifted_data, shift] = useState( JSON.parse(JSON.stringify(data)));

  // Function to check if two points overlap
  function overlap(owner1, owner2, margin = 5) {
    const { vacancy_perc: x1, delta_cashflow_perc: y1 } = owner1;
    const { vacancy_perc: x2, delta_cashflow_perc: y2 } = owner2;
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance < margin;
  }

  // Function to adjust points
  function adjustPoints(owners, margin = 10) {
    for (let i = 0; i < owners.length; i++) {
      for (let j = i + 1; j < owners.length; j++) {
        while (overlap(owners[i], owners[j], margin)) {
          // Move points slightly in both x and y directions
          owners[j].vacancy_perc -= Math.random() * (2 * margin) - margin;
          owners[j].delta_cashflow_perc -= Math.random() * (2 * margin) - margin;
        }
      }
    }
    return owners;
  }

  
  //  Adjust points before rendering
   useEffect(() => {
    shift( adjustPoints(shifted_data));
   }, []);

  const axisLabelStyle = {
    fontFamily: 'Source Sans Pro',
    color: '#160449',
    fontWeight: 'bold',
  };

  const [clickedIndex, setClickedIndex] = useState(null);
  const [hiddenPoints, setHiddenPoints] = useState([]);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handlePointClick = (payload) => {
    let { index } = payload;
    if (clickedIndex === index) {
      setHiddenPoints((prevHiddenPoints) => [...prevHiddenPoints, index]);
    } else {
      setClickedIndex(index);
      let owner= data.find((o)=>o.index===index)
      dataSetter(owner);
    }
    setTooltipVisible(true);
  };

  const handleShowAllPoints = () => {
    setHiddenPoints([]);
  };

  return (
    <div>
      <button
        style={{ top: chartMargin.top + 20, left: 10, zIndex: 999 }}
        onClick={handleShowAllPoints}
      >
        Show All Owners
      </button>

      <ScatterChart
        width={chartWidth}
        height={chartHeight}
        margin={chartMargin}
        onClick={() => setTooltipVisible(!tooltipVisible)}
      >
        <CartesianGrid />

        <YAxis
  type="number"
  dataKey="delta_cashflow_perc"
  name="Delta Cashflow"
  axisLine={false}
  tickLine={false}
  style={axisLabelStyle}
  tick={{ transform: 'translate(-10, 7.5)' }}
  label={{
    value: 'Delta Cashflow',
    angle: -90,
    position: 'insideLeft',
    dx: -20,
    dy: 40,
    style: axisLabelStyle,
    fill: '#160449',
  }}
  domain={[-100, 0]}
  ticks={[-100, -50, 0]} // Add this line
/>

<XAxis
  type="number"
  dataKey="vacancy_perc"
  name="Vacancies"
  axisLine={false}
  tickLine={false}
  style={axisLabelStyle}
  tick={{ transform: 'translate(0, 10)' }}
  label={{
    value: 'Vacancies',
    position: 'insideBottom',
    dy: 40,
    dx: 0,
    style: axisLabelStyle,
    fill: '#160449',
  }}
  domain={[-100, 0]}
  ticks={[-100, -50, 0]} // Add this line
/>

        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ payload }) => {
            if (payload && payload.length && tooltipVisible) {
              const dataPoint = payload[0].payload;
              return (
                <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                  <p><strong>Name:</strong> {dataPoint.name}</p>
                  <p><strong>Delta Cashflow:</strong> {dataPoint.delta_cashflow_perc}</p>
                  <p><strong>Vacancies:</strong> {dataPoint.vacancy_perc}</p>
                </div>
              );
            }
            return null;
          }}
        />

        <Scatter
          name="A school"
          data={shifted_data}
          shape={(props) => (
            <CustomImage
              {...props}
              onClick={() => handlePointClick(props.payload)}
              isClicked={props.payload.index === clickedIndex}
              isVisible={!hiddenPoints.includes(props.payload.index)}
            />
          )}
        >
          {shifted_data.map((point, index) => (
            !hiddenPoints.includes(index) && (
              <Scatter
                key={`hidden-${index}`}
                data={[point]}
                shape={(props) => (
                  <CustomImage
                    {...props}
                    isClicked={false}
                    isVisible={false}
                  />
                )}
              />
            )
          ))}
        </Scatter>

        <ReferenceLine
          y={-50}
          stroke="#000000"
          strokeDasharray="3 3"
        />

        <ReferenceLine
          x={-50}
          stroke="#000000"
          strokeDasharray="3 3"
        />

        <ReferenceLine
          segment={[{ x: -100, y: -100 }, { x: 100, y: 100 }]}
          stroke="#000000"
          strokeWidth={1}
          ifOverflow="hidden"
        />
      </ScatterChart>
    </div>
  );
}

const CustomImage = (props) => {
  const { cx, cy, payload, onClick, isClicked, isVisible, index } = props;

  if (!isVisible) {
    return null;
  }

  const diameter = 30;
  const outlineWidth = isClicked ? 4 : 2;

  return (
    <g onClick={() => onClick(payload.name)}>
      <foreignObject x={cx - diameter / 2} y={cy - diameter / 2} width={diameter} height={diameter}>
        {![null, undefined, ''].includes(payload?.photo) ? (
          <img
            src={payload.photo}
            alt="scatter-image"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <AccountCircleIcon
            sx={{
              color: payload.color,
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              borderWidth: outlineWidth,
              borderStyle: 'solid',
            }}
          />
        )}
      </foreignObject>
      {payload?.photo && (
        <circle
          cx={cx}
          cy={cy}
          r={diameter / 2 + outlineWidth / 2}
          fill="none"
          stroke={payload.color}
          strokeWidth={outlineWidth}
        />
      )}
    </g>
  );
};
