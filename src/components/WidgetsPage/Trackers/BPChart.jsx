import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import './BPChart.css';

const BloodPressureChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSystolic, setNewSystolic] = useState('');
  const [newDiastolic, setNewDiastolic] = useState('');
  const [newTimestamp, setNewTimestamp] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/bloodpressure?page=${page}&limit=${limit}`);
      const data = response.data;

      const systolicValues = data.map(item => item.systolic);
      const diastolicValues = data.map(item => item.diastolic);
      const timeStamps = data.map(item => new Date(item.timestamp).toLocaleString());

      setChartData({
        labels: timeStamps,
        datasets: [
          {
            label: 'Systolic Pressure',
            data: systolicValues,
            borderColor: '#ff6384',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Diastolic Pressure',
            data: diastolicValues,
            borderColor: '#36a2eb',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4
          }
        ]
      });

      // Calculate total pages based on total count
      const totalCount = parseInt(response.headers['x-total-count']);
      setTotalPages(Math.ceil(totalCount / limit));

      setLoading(false);
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      setError('Error fetching data');
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newEntry = {
      systolic: newSystolic,
      diastolic: newDiastolic,
      timestamp: newTimestamp
    };

    try {
      await axios.post('http://localhost:5000/api/bloodpressure', newEntry);
      setNewSystolic('');
      setNewDiastolic('');
      setNewTimestamp('');

      // Refresh data to include the newly added entry
      fetchData(page);

    } catch (error) {
      console.error("There was an error submitting the data!", error);
      setError('Error submitting data');
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h1>Blood Pressure Tracking</h1>
      {chartData ? (
        <Line 
          data={chartData}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Date/Time',
                  color: '#666'
                }
              },
              y: {
                beginAtZero: false,
                title: {
                  display: true,
                  text: 'Blood Pressure (mmHg)',
                  color: '#666'
                },
                ticks: {
                  callback: function(value) {
                    return value + ' mmHg';
                  }
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#333'
                }
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            maintainAspectRatio: true
          }}
        />
      ) : (
        <p>No data available</p>
      )}

      <form onSubmit={handleSubmit} className="form">
        <label className='label'>
          Systolic Pressure:
          <input 
            type="number" 
            value={newSystolic}
            onChange={(e) => setNewSystolic(e.target.value)}
            required className='inputarea'
          />
        </label>
        <label className='label'>
          Diastolic Pressure:
          <input 
            type="number" 
            value={newDiastolic}
            onChange={(e) => setNewDiastolic(e.target.value)}
            required className='inputarea'
          />
        </label>
        <label className='label'>
          Timestamp:
          <input 
            type="datetime-local" 
            value={newTimestamp}
            onChange={(e) => setNewTimestamp(e.target.value)}
            required className='inputarea'
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      <div className="navigation">
        <button onClick={handlePrevious} disabled={page === 1}>Previous</button>
        <button onClick={handleNext} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default BloodPressureChart;
