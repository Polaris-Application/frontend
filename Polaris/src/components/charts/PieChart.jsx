import React, { useMemo } from 'react';
import { Line, Pie } from 'react-chartjs-2';
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
  ArcElement,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { getColor, getColorsForPie } from '../../utils/colourConfig';

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const PieChart = ({ title, data, labels }) => {
  const colors = useMemo(() => {
    return labels?.map(() => {return getColor()})
  }, labels)

  const chartData = {
    labels: labels || ['red', 'blue', 'yellow'],
    datasets: [
      {
        label: 'piechartData',
        data: data,
        backgroundColor: colors || '#36a2eb',
        fill: false,
        tension: 0.2,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: !!title, text: title },
    }
  };
  
  return (
    <div style={{ width: '100%' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
