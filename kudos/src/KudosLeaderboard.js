import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const KudosLeaderboard = () => {
  const [kudosData, setKudosData] = useState([]);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Fetch kudos data from the backend
    axios.get('http://localhost:5000/api/kudos')
      .then((response) => {
        setKudosData(response.data);
        generateChartData(response.data);  // Generate chart data
      })
      .catch((error) => {
        console.error("There was an error fetching the kudos data!", error);
      });
  }, []);

  const generateChartData = (data) => {
    const employeeNames = data.map(item => item.employee);
    const ratings = data.map(item => item.rating);

    setChartData({
      labels: employeeNames,
      datasets: [
        {
          label: 'Kudos Ratings',
          data: ratings,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  return (
    <div>
      <h2>Kudos Leaderboard</h2>
      <div className="leaderboard">
        {kudosData.map((item, index) => (
          <div key={index} className="leaderboard-item">
            <h3>{item.employee}</h3>
            <p>{item.message}</p>
            <p>Rating: {item.rating}</p>
          </div>
        ))}
      </div>

      <h2>Ratings Bar Chart</h2>
      {kudosData.length > 0 && <Bar data={chartData} />}
    </div>
  );
};

export default KudosLeaderboard;
