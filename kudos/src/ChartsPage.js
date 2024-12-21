// src/ChartsPage.js
import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ChartsPage() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [kudosCounts, setKudosCounts] = useState({});
  const [employeeRatings, setEmployeeRatings] = useState({});

  const fetchKudos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kudos');
      generateReport(response.data);
    } catch (error) {
      console.error('Error fetching Kudos:', error);
      alert('Error fetching Kudos');
    }
  };

  const generateReport = (kudosData) => {
    if (!kudosData || kudosData.length === 0) {
      setChartData({ labels: [], datasets: [] });
      setKudosCounts({});
      setEmployeeRatings({});
      return;
    }

    const employeeNames = [];
    const kudosCountMap = {};
    const ratingsMap = {};

    kudosData.forEach(kudo => {
      const employeeName = kudo.employee;
      employeeNames.push(employeeName);
      kudosCountMap[employeeName] = (kudosCountMap[employeeName] || 0) + 1;
      ratingsMap[employeeName] = (ratingsMap[employeeName] || 0) + kudo.rating;
    });

    const uniqueEmployeeNames = [...new Set(employeeNames)];
    const employeeKudosCount = uniqueEmployeeNames.map(name => kudosCountMap[name]);
    const employeeAvgRating = uniqueEmployeeNames.map(name => ratingsMap[name] / kudosCountMap[name]);

    setChartData({
      labels: uniqueEmployeeNames,
      datasets: [
        {
          label: 'Number of Kudos',
          data: employeeKudosCount,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
        {
          label: 'Average Rating',
          data: employeeAvgRating,
          fill: false,
          borderColor: 'rgb(255, 159, 64)',
          tension: 0.1
        }
      ]
    });

    setKudosCounts(kudosCountMap);
    setEmployeeRatings(ratingsMap);
  };

  useEffect(() => {
    fetchKudos();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kudos Analysis Reports</h1>
        <div className="chart-section">
          <h2>Kudos Report (Chart)</h2>
          <div className="chart-container">
            {chartData.labels.length > 0 ? (
              <Line data={chartData} />
            ) : (
              <p>No data available for the report.</p>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default ChartsPage;
