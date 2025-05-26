import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  const chartData: ChartData<'bar'> = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: 'Value',
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color || 'rgba(75, 192, 192, 0.6)'),
        borderColor: data.map((item) => item.color || 'rgb(75, 192, 192)'),
        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: !!title,
        text: title
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          }
        }
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
    }
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart; 