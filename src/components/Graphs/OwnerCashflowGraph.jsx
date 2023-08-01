import React from 'react';
import { Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const data = [
  { name: 'Jan', sales: 5000, profit: 2000 },
  { name: 'Feb', sales: 8000, profit: 4000 },
  { name: 'Mar', sales: 10000, profit: 6000 },
  // Add data for other months (up to 12)
];

const MixedChart = (props) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} />
        <YAxis yAxisId="right" orientation="right" />
        <Legend />
        <Bar yAxisId="left" dataKey="sales" fill="#8884d8" barSize={30} name="Sales" />
        <Line yAxisId="left" type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default MixedChart;
