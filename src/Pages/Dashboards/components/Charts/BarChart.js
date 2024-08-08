import React, { useContext, useMemo, useState, useEffect } from "react";
// import { userIcon1 } from "../../../../utils/ImportingImages/ImportingImages";
import axios from "axios";
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { ContextAPI } from "../../../../Context/ApiContext/ApiContext";
import {
  handleAPIError,
  headerOptions,
} from "../../../../utils/utilities/utilityFunctions";

import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = () => {
  const { mainURL } = useContext(ContextAPI);
  const userId = localStorage.getItem("userId") ?? null;
  const [statisticDataList, setStatisticDataList] = useState([]);
  const userRole = localStorage.getItem("userRole");
  
  const handleStatisticData = async () => {
    let  url = `${mainURL}dashboard/statistics/${userId}`;
     
     try {
       const result = await axios.get(url, { headers: headerOptions() });
       const statisticDataList = result?.data?.statistic_data ?? [];
       setStatisticDataList(statisticDataList);
     } catch (error) {
       console.error("Error fetching statistic Data List:", error);
     }
   };
   useEffect(() => {
     handleStatisticData();
   }, []);
  
  const labels = statisticDataList.map((item) => item.label);

  
  const data = {
    labels: labels,

    datasets: [
      {
        label: "In Progress Job",
        data: statisticDataList.map((item) => item.data.in_progress_jobs),
        backgroundColor: "#dc8400",
        
      },
      {
        label: "Completed Job", 
        data: statisticDataList.map((item) => item.data.total_completed_jobs), // on y axis
        backgroundColor: "#0f5e0f",
      
      },
      {
        label: "Hold Job", 
        data: statisticDataList.map((item) => item.data.on_hold_jobs), // on y axis

        backgroundColor: "#9f1c20",
      },
      {
        label: "Assign Job", 
        data: statisticDataList.map((item) => item.data.total_assign_jobs), // on y axis
        backgroundColor: "#319cd1"
      },
    ],
  };

  const options = {
    plugins: {
      
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Count Of Jobs", 
          color: "#000",
          font: {
            size: 16,
            weight: "bold",
          },
          padding: { top: 20, bottom: 0 }, 
        },
        ticks: {
          color: "#000",
          font: {
            weight: "500",
            size: 14,
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Name Of Last Three Months", 
          color: "#000",
          font: {
            size: 16,
            weight: "bold",
          },
          padding: { top: 20, bottom: 0 }, 
        },
        ticks: {
          color: "#000",
          font: {
            weight: "500",
            size: 15,
          },
        },
      },
    },
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-2">
      <Bar data={data} options={options}></Bar>
    </div>
  );
};

export default BarChart;
