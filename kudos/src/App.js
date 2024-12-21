import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [kudosList, setKudosList] = useState([]);
  const [message, setMessage] = useState('');
  const [employee, setEmployee] = useState('');
  const [rating, setRating] = useState(1);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [kudosCounts, setKudosCounts] = useState({});
  const [employeeRatings, setEmployeeRatings] = useState({});

  const fetchKudos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/kudos');
      setKudosList(response.data);
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

  const addKudos = async () => {
    if (!employee || !message) {
      alert('Employee name and message are required!');
      return;
    }
    const newKudos = { employee, message, date: new Date(), rating };

    try {
      await axios.post('http://localhost:5000/api/kudos', newKudos);
      setEmployee('');
      setMessage('');
      setRating(1);
      fetchKudos();
    } catch (error) {
      console.error('Error sending Kudos:', error);
      alert('Error sending Kudos');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kudos Application</h1>
        <div className="kudos-form">
          <input
            type="text"
            placeholder="Employee Name"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
          />
          <textarea
            placeholder="Write your Kudos"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            placeholder="Rating (1-5)"
          />
          <button onClick={addKudos}>Send Kudos</button>
        </div>

        <div className="dashboard">
          <div className="inline-sections">
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

            <div className="leaderboard-section">
              <h2>Leaderboard</h2>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Kudos Count</th>
                    <th>Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(kudosCounts).map((employeeName) => (
                    <tr key={employeeName}>
                      <td>{employeeName}</td>
                      <td>{kudosCounts[employeeName]}</td>
                      <td>{(employeeRatings[employeeName] / kudosCounts[employeeName]).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
