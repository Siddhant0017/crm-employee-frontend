import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../../styles/SalesAnalyticsChart.css';

const getDayName = (dateString) => {
  const utcDate = new Date(dateString);
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istDate = new Date(utcDate.getTime() + istOffset);
  return istDate.toLocaleDateString('en-US', { weekday: 'short' });
};


const SalesAnalyticsChart = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    day: getDayName(item.date)
  }));

  return (
    <div className="sales-analytics-chart">
      <h3 className="sales-chart-title">Sales Analytics</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: '#555' }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#555' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: 8, fontSize: 12 }}
              formatter={(value) => [`${value} Sales`, 'Total']}
              labelFormatter={(label, payload) => {
                if (payload.length) {
                  return `${payload[0].payload.date} (${label})`;
                }
                return label;
              }}
            />
            <Bar
              dataKey="totalSales"
              fill="#d9d9d9"
              radius={[6, 6, 0, 0]}
              barSize={35}
            />
          </BarChart>

        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesAnalyticsChart;