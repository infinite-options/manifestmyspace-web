import React, { Component } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    Cell,
    ResponsiveContainer
  } from "recharts";
  
  const data = [
    { x: -100, y: -200, z: 200 },
    { x: -100, y: 200, z: 200 },
    { x: 120, y: 100, z: 260 },
    { x: 120, y: -100, z: 260 },
    { x: 170, y: 300, z: 400 },
    { x: -140, y: -250, z: 500 },
    { x: -140, y: 250, z: 280 },
    { x: 150, y: 400, z: 500 },
    { x: 110, y: 280, z: 200 },
    { x: 110, y: -280, z: 200 }
  ];
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];
  
  export default function HappinessMatrix() {
    return (
      <ResponsiveContainer>
      <ScatterChart
        width={500}
        height={400}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="stature" axisLine={false} tick={false}/>
        <YAxis type="number" dataKey="y" name="weight" axisLine={false} tick={false}/>
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="A school" data={data} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Scatter>
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <ReferenceLine y={0} stroke="#000000" strokeDasharray="3 3" />
        <ReferenceLine x={0} stroke="#000000" strokeDasharray="3 3" />
        <ReferenceLine
          segment={[
            { 
              x: -500,
              y: -500
            },
            { 
              x: 500, 
              y: 500 
            }]}
        //   label={{
        //     value: "(0,0)",
        //     position: "bottom"
        //   }}
            stroke="#000000"
            strokeWidth={2}
            ifOverflow="extendDomain" 
        />
      </ScatterChart>
      </ResponsiveContainer>
    );
  }
  