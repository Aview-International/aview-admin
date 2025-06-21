import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const signupData = [
  { date: 'Jun 1', signups: 28 },
  { date: 'Jun 2', signups: 35 },
  { date: 'Jun 3', signups: 42 },
  { date: 'Jun 4', signups: 30 },
  { date: 'Jun 5', signups: 48 },
  { date: 'Jun 6', signups: 55 },
  { date: 'Jun 7', signups: 45 },
  { date: 'Jun 8', signups: 50 },
  { date: 'Jun 9', signups: 62 },
  { date: 'Jun 10', signups: 58 },
  { date: 'Jun 11', signups: 70 },
  { date: 'Jun 12', signups: 65 },
];

export default function NewSignupsChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={signupData}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" stroke="#bbb" />
          <YAxis stroke="#bbb" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#333',
              borderColor: '#555',
              color: '#fff',
            }}
            labelStyle={{ color: '#aaa' }}
          />
          <Legend wrapperStyle={{ color: '#ccc' }} />
          <Line
            type="monotone"
            dataKey="signups"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="New Signups"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
