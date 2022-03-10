import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import Chart from 'chart.js/auto';

function BarChart() {
  const dataBarChart = useSelector(
    state => state.tableDashboard.listDataSummary,
  );

  const labels = dataBarChart.labels?.slice(1, -1).split(',');
  const onboard = dataBarChart.list_onboard?.split(',');
  const target = dataBarChart.list_target?.split(',');
  const data = {
    labels: labels,

    datasets: [
      {
        label: 'Onboard',
        backgroundColor: 'rgb(133, 92, 248,0.6)',
        borderRadius: 3,
        data: onboard,
        barThickness: 20,
        maxBarThickness: 20,
      },

      {
        label: 'Request',
        borderRadius: 3,
        backgroundColor: ['rgb(133, 92, 248,0.2)'],
        data: target,
        barThickness: 20,
        maxBarThickness: 20,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: { titleFont: { size: '16px' } },
    },

    scales: {
      x: {
        ticks: {
          display: false,
          autoSkip: false,
        },
        stackWeight: 1,
        grid: {
          drawBorder: false,
          display: false,
        },
        stacked: true,
      },
      y: {
        ticks: { beginAtZero: true },
        grace: '10%',
        display: false,
        grid: {
          drawBorder: false,
          display: false,
        },

        stacked: true,
      },
    },
  };
  return (
    <div className="bar">
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;
