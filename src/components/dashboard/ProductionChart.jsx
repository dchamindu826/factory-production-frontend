import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data - this structure would ideally come from your backend
const dailyData = [
  { name: 'Style A', processed: 40, target: 60 },
  { name: 'Style B', processed: 60, target: 70 },
  { name: 'Style C', processed: 30, target: 50 },
];
const weeklyData = [
  { name: 'Style A', processed: 250, target: 300 },
  { name: 'Style B', processed: 350, target: 400 },
  { name: 'Style C', processed: 180, target: 250 },
];
const monthlyData = [
  { name: 'Style A', processed: 1000, target: 1200 },
  { name: 'Style B', processed: 1500, target: 1800 },
  { name: 'Style C', processed: 700, target: 1000 },
];

const ProductionChart = ({ title }) => {
  const [timeframe, setTimeframe] = useState('daily'); // 'daily', 'weekly', 'monthly'

  const getData = () => {
    switch (timeframe) {
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const chartData = getData();

  return (
    <div className="chart-container card"> {/* Use existing card style or a new one */}
      <h3>{title} - {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</h3>
      <div className="timeframe-selector">
        <button onClick={() => setTimeframe('daily')} className={timeframe === 'daily' ? 'active' : ''}>Daily</button>
        <button onClick={() => setTimeframe('weekly')} className={timeframe === 'weekly' ? 'active' : ''}>Weekly</button>
        <button onClick={() => setTimeframe('monthly')} className={timeframe === 'monthly' ? 'active' : ''}>Monthly</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="processed" fill="#8884d8" name="Processed Quantity" />
          <Bar dataKey="target" fill="#82ca9d" name="Target Quantity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductionChart;