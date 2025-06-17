import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const growthRateData = [
  { month: 'Jan', rate: 0.05 },
  { month: 'Feb', rate: 0.06 },
  { month: 'Mar', rate: 0.07 },
  { month: 'Apr', rate: 0.08 },
  { month: 'May', rate: 0.075 },
  { month: 'Jun', rate: 0.08 },
  { month: 'Jul', rate: 0.082 },
  { month: 'Aug', rate: 0.085 },
  { month: 'Sep', rate: 0.078 },
  { month: 'Oct', rate: 0.081 },
  { month: 'Nov', rate: 0.083 },
  { month: 'Dec', rate: 0.088 },
];

export default function GrowthRateChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={growthRateData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="month" stroke="#bbb" />
          <YAxis
            stroke="#bbb"
            tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
          />
          <Tooltip
            formatter={(value) => [
              `${(value * 100).toFixed(1)}%`,
              'Growth Rate',
            ]}
            contentStyle={{
              backgroundColor: '#333',
              borderColor: '#555',
              color: '#fff',
            }}
            labelStyle={{ color: '#aaa' }}
          />
          <Legend wrapperStyle={{ color: '#ccc' }} />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#82ca9d"
            fill="#82ca9d"
            fillOpacity={0.3}
            name="Growth Rate"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
