import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Dataset {
  label: string;
  data: number[];
  color: string;
}

interface LineChartProps {
  data: Dataset[];
  labels: string[];
  height?: number;
  options?: ChartOptions<'line'>;
}

const LineChart: React.FC<LineChartProps> = ({ data, labels, height = 300, options }) => {
  const chartData = {
    labels,
    datasets: data.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.color,
      backgroundColor: dataset.color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
      tension: 0.4,
      fill: true
    }))
  };

  const defaultOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

export { LineChart };
export type { Dataset }; 