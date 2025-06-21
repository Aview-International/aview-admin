import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const socialData = [
  { name: 'YouTube', value: 5000 },
  { name: 'TikTok', value: 4000 },
  { name: 'Instagram', value: 2000 },
  { name: 'Facebook', value: 1450 },
];

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];

export default function SocialMediaDistributionChart() {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={socialData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {socialData.map((_,index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value} videos`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
