import React from "react";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Tooltip, Legend, ArcElement);

const DoughnutChart = () => {
  const data = {
    labels: ["Active Project", "Project On Halt", "Completed Projects"],
    datasets: [
      {
        label: "Poll",
        data: [5, 1, 2],
        backgroundColor: ["#005182", "#9F1C20", "#faa31f"],
        borderColor: ["transparent"],
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#000",
          font: {
            size: 13,
            family: "Inter, sans-serif",
            weight: "500",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed}`;
          },
        },
      },
    },
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-1">
      <Doughnut options={options} data={data} />
    </div>
  );
};

export default DoughnutChart;
