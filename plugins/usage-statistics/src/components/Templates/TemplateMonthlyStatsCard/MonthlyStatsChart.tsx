import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import { MonthlyStat } from '../../../types';

interface MonthlyStatsChartProps {
  data: MonthlyStat[];
  height?: number;
}

export const MonthlyStatsChart = ({
  data,
  height = 300,
}: MonthlyStatsChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="success" fill="#4caf50" name="Success" />
        <Bar dataKey="failed" fill="#f44336" name="Failed" />
        <Bar dataKey="total" fill="#8884d8" name="Total" />
      </BarChart>
    </ResponsiveContainer>
  );
};
