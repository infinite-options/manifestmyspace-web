import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, ComposedChart, Cell, ReferenceLine } from 'recharts';
import theme from "../../theme/theme";
import { Stack, Typography } from '@mui/material';

const data1 = [
  { name: 'Jan', cashflow: 5000, revenue: 2000 },
  { name: 'Feb', sales: 8000, profit: 4000 },
  { name: 'Mar', sales: 10000, profit: 6000 },
  { name: 'Apr', sales: 9000, profit: 6000 },
  { name: 'May', sales: 8000, profit: 8000 },
  { name: 'Jun', sales: 10000, profit: 4000 },
  { name: 'Jul', sales: 5000, profit: 2000 },
  { name: 'Aug', sales: 4000, profit: 3000 },
  { name: 'Sep', sales: 8000, profit: 1000 },
  { name: 'Oct', sales: 6000, profit: 5000 },
  { name: 'Nov', sales: 10000, profit: 6000 },
  { name: 'Dec', sales: 8000, profit: 3000 },
  // Add data for other months (up to 12)
];

const MixedChart = (props) => {
  const data = props.revenueCashflowByMonth;
  return (
    <ThemeProvider theme={theme}>
    <ResponsiveContainer>
      <ComposedChart data={data} margin={{ top: 20, right: -10, left: -10, bottom: 5 }}>
        <CartesianGrid vertical={false} />
          <XAxis
            dataKey="monthYear" 
            axisLine={false}
            style={{
            fontSize: '10px'
            }} />
          {/* type="number" domain={[0, 50000]} tickCount={11} interval={1000}  */}
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickCount={8}
            domain={[-5000, 30000]}
            tickFormatter={(value) => `$${value}`}
            style={{
            fontSize: '10px'
          }} />
          <ReferenceLine yAxisId="left" y={0} stroke='#000000' strokeWidth={1}/>
        <YAxis yAxisId="right" orientation="right" />
        <Legend />
        <Bar 
            yAxisId="left"
            dataKey="cashflow"
            fill={theme.typography.common.blue}
            barCategoryGap={10}
            barSize={15}
            name="Cashflow">
            {data.map((entry, index) => (
            <Cell fill={entry.cashflow < 0 ? theme.palette.custom.red : theme.typography.common.blue }/>
            ))}
          </Bar>
        <Line 
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke={theme.palette.primary.mustardYellow}
            strokeWidth={5}
            name="Revenue"
            dot={{ stroke: theme.palette.primary.mustardYellow}}
          />
      </ComposedChart>
      </ResponsiveContainer>
    </ThemeProvider>
  );
};

export default MixedChart;
