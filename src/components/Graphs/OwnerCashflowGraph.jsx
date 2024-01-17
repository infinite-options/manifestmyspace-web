import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, ComposedChart, Cell, ReferenceLine } from 'recharts';
import theme from "../../theme/theme";
import { Stack, Typography } from '@mui/material';

const data1 = [
  { name: 'Jan', cashflow: 5000, revenue: 2000 },
  { name: 'Feb', cashflow: 8000, revenue: 4000 },
  { name: 'Mar', cashflow: 10000, revenue: 6000 },
  { name: 'Apr', cashflow: 9000, revenue: 6000 },
  { name: 'May', cashflow: 8000, revenue: 8000 },
  { name: 'Jun', cashflow: 10000, revenue: 4000 },
  { name: 'Jul', cashflow: 5000, revenue: 2000 },
  { name: 'Aug', cashflow: 4000, revenue: 3000 },
  { name: 'Sep', cashflow: 8000, revenue: 1000 },
  { name: 'Oct', cashflow: 6000, revenue: 5000 },
  { name: 'Nov', cashflow: 10000, revenue: 6000 },
  { name: 'Dec', cashflow: 8000, revenue: 3000 },
  // Add data for other months (up to 12)
];

const MixedChart = (props) => {
  const data = props.revenueCashflowByMonth; // In the future Change <ComposedChart data={data1} --> <ComposedChart data={data}
  const activeButton = props.activeButton;
  const selectedProperty = props.selectedProperty;
  return (
    <ThemeProvider theme={theme}>
    <ResponsiveContainer>
      <ComposedChart data={data1} margin={{ top: 20, right: -10, left: -10, bottom: 5 }}>
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
            // domain={selectedProperty!=={} ? [-2000,7000] : [-5000, 30000]}
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
            dataKey= {activeButton === "ExpectedCashflow" ? "expectedCashflow" : "cashflow"}
            fill={theme.typography.common.blue}
            barCategoryGap={10}
            barSize={15}
            name="Cashflow">
            {data.map((entry, index) => (
              <Cell key={index} fill={(activeButton === "ExpectedCashflow" && entry.expectedCashflow<0) || (activeButton === "Cashflow" && entry.cashflow < 0) ? theme.palette.custom.red : theme.typography.common.blue }/>
            ))}
          </Bar>
        <Line 
            yAxisId="left"
            type="monotone"
            dataKey= {activeButton === "ExpectedCashflow" ? "expectedRevenue" : "revenue"}
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
