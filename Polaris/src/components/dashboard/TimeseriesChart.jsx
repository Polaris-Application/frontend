import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const TimeseriesChart = ({ title, data, label, color }) => {
  const chartData = {
    labels: data.map((d) => d.x),
    datasets: [
      {
        label: label,
        data: data.map((d) => d.y),
        borderColor: color || '#36a2eb',
        backgroundColor: color || '#36a2eb',
        fill: false,
        tension: 0.2,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: !!title, text: title },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'minute' },
        title: { display: true, text: 'Time' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: label },
      },
    },
  };

  return <Line data={chartData} options={options} height={180} />;
};

export default TimeseriesChart;
