import React from 'react';
import { Line, Pie, Scatter } from 'react-chartjs-2';
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

const ScatterChart = ({ title, data, labelx, labely, color }) => {
  const chartData = {
    datasets: [
      {
        data: data,
        borderColor: color || '#36a2eb',
        backgroundColor: color || '#36a2eb',
        fill: false,
        tension: 0.2,
        pointRadius: 5,
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
        type: 'linear',
        position: 'bottom',
        title: { display: true, text: labelx },
      },
      y: {
        title: { display: true, text: labely },
      },
    },
  };
  
  return (
    <div style={{ width: '100%' }}>
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default ScatterChart;
