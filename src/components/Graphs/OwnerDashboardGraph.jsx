import { ThemeProvider } from "@emotion/react";
import React from "react";
import { Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, ComposedChart, Cell, ReferenceLine } from "recharts";
import theme from "../../theme/theme";
import { Stack, Typography } from "@mui/material";

// THIS IS A DUPLICATE OF OwnerCashflowGraph.  See if there is a way to combine these 2 pages
const DashboardChart = (props) => {
  // I want props.revenueCashflowByMonth to be sorted in order of month and year

  const data = props.revenueCashflowByMonth; // In the future Change <ComposedChart data={data1} --> <ComposedChart data={data}
  console.log("ROHIT - DashboardChart - data - ", data);
  const activeButton = props.activeButton;
  // console.log("Input data to graph: ", data);
  // console.log("Active button: ", activeButton);

  // const selectedProperty = props.selectedProperty;
  // find max and min of data
  const max = Math.max.apply(
    Math,
    data.map(function (o) {
      // console.log("max: ", o.cashflow);
      return o.cashflow;
    })
  );
  const min = Math.min.apply(
    Math,
    data.map(function (o) {
      // console.log("min: ", o.cashflow);
      return o.cashflow;
    })
  );

  return (
    <ThemeProvider theme={theme}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 20, right: -45, left: -10, bottom: 5 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="monthYear"
            axisLine={true}
            type="category"
            tickCount={12}
            style={{
              fontSize: "10px",
            }}
          />
          <YAxis
            yAxisId="left"
            axisLine={false}
            tickCount={8}
            domain={[(min - 1000) * 1.1, max * 2]}
            tickFormatter={(value) => `$${value}`}
            style={{
              fontSize: "10px",
            }}
          />
          <ReferenceLine yAxisId="left" y={0} stroke="#000000" strokeWidth={1} />
          <YAxis yAxisId="right" orientation="right" />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey={activeButton === "ExpectedCashflow" ? "expected_cashflow" : "cashflow"}
            fill={theme.typography.common.blue}
            barCategoryGap={10}
            barSize={15}
            name="Actual Cashflow"
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  (activeButton === "ExpectedCashflow" && entry.expectedCashflow < 0) || (activeButton === "Cashflow" && entry.cashflow < 0)
                    ? theme.palette.custom.red
                    : theme.typography.common.blue
                }
              />
            ))}
          </Bar>
          
          <Bar
            yAxisId="left"
            dataKey={"expected_cashflow"}
            fill={theme.palette.primary.mustardYellow}
            barCategoryGap={10}
            barSize={15}
            name="Expected Cashflow"
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  (entry.expected_cashflow < 0)
                    ? theme.palette.custom.red
                    : theme.palette.primary.mustardYellow
                }
              />
            ))}
          </Bar>

          {/* <Line
            yAxisId="left"
            type="monotone"
            dataKey={activeButton === "ExpectedCashflow" ? "expectedRevenue" : "expected_cashflow"}
            stroke={theme.palette.primary.mustardYellow}
            strokeWidth={5}
            name="Expected Cash Flow"
            dot={{ stroke: theme.palette.primary.mustardYellow }}
          /> */}

          <Line
            yAxisId="left"
            type="monotone"
            dataKey={"expected_revenue"}
            stroke={theme.palette.custom.red}
            strokeWidth={5}
            name="Expected Revenue"
            dot={{ stroke: theme.palette.custom.red }}
          />

          <Line
            yAxisId="left"
            type="monotone"
            dataKey={"revenue"}
            stroke={"#000000"}
            strokeWidth={5}
            name="Actual Revenue"
            dot={{ stroke: "#000000" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ThemeProvider>
  );
};

export default DashboardChart;
