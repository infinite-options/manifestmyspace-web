import React from 'react';
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

export default function HappinessMatrix(props) {
  const chartWidth = 800;
  const chartHeight = 800;
  const chartMargin = { top: 20, right: 20, bottom: 20, left: 20 };
  const { data, dataSetter } = props;

  const axisLabelStyle = {
    fontFamily: 'Source Sans Pro',
    color: '#160449', // Set the desired color
    fontWeight: 'bold', // Set the bold style
  };

  return (
    <ResponsiveContainer>
      <ScatterChart width={chartWidth} height={chartHeight} margin={chartMargin}>
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
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter
          name="A school"
          data={data}
          shape={<CustomImage />}
          onClick={(event) => dataSetter((prev) => ({ ...prev, name: event.payload.name }))}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <ReferenceLine
          y={0}
          stroke="#000000"
          strokeDasharray="3 3"
          label={{ value: 'Delta Cashflow', angle: -90, position: 'insideLeft', dx: -30, dy: 50, style: axisLabelStyle, fill: '#160449' }}
        />
        <ReferenceLine
          x={0}
          stroke="#000000"
          strokeDasharray="3 3"
          label={{ value: 'Vacancies', position: 'insideBottom', dy: 30, style: axisLabelStyle, fill: '#160449' }}
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

const CustomImage = (props) => {
  const { cx, cy, payload } = props;
  const radius = 20; // Adjust the radius as needed

  return (
    <image
      x={cx - radius / 2}
      y={cy - radius / 2}
      width={radius}
      height={radius}
      xlinkHref={payload.photo} // Assuming 'photo' is the property containing the image URL
    />
  );
};
