import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function DoughnutChart({ data, plugins }) {
  Chart.defaults.color = '#fff';
  Chart.defaults.font = { size: 2 };
  const options = {
    plugins: {
      tooltip: true,
      legend: {
        display: false,
      },
    },
    responsive: true,
    cutout: 120,
  };

  return (
    <Doughnut
      className="doughnut"
      data={data}
      options={options}
      plugins={plugins}
    />
  );
}
export default DoughnutChart;
