import React from 'react';
import { Bar } from 'react-chartjs-2';
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
  BarElement,
  scales,
  Ticks,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
);

function computeHistogram(data, numBins = 10){
    if(data.length === 0) return {bins: [], counts: []};
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / numBins;

    const bins = Array(numBins).fill(0);
    const labels = [];

    for(let value of data){
        let bin = Math.floor((value - min) / binWidth);
        if(bin === numBins) bin--;
        bins[bin]++;
    }

    for(let i = 0; i < numBins; i++){
        const from = (min + i * binWidth).toFixed(1);
        const to = (min + (i + 1) * binWidth).toFixed(1);
        labels.push(`${from}-${to}`);
    }

    return {bins: labels, counts: bins};
}

const HistogramChart = ({ title, labelx, labely, data, binCount, color }) => {
    const {bins, counts} = computeHistogram(data, binCount);
    const chartData = {
    labels: bins,
    datasets: [
      {
        label: 'Frequency',
        data: counts,
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
      legend: { position: 'bottom' },
      title: { display: !!title, text: title },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: labelx,
            },
        },
        y:{
            title:{
                display: true,
                text: labely,
            },
            beginAtZero: true,
            Ticks: {
                precision: 0,
            }
        }
    }

  };
  
  return (
    <div style={{ width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default HistogramChart;
