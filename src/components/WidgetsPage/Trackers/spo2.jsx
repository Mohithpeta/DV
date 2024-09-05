import { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import './spo2.css';

const SpO2Chart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSpO2, setNewSpO2] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [spO2Data, setSpO2Data] = useState([]);

  const updateChartData = useCallback((data) => {
    setChartData({
      labels: data.map(item => item.timestamp),
      datasets: [
        {
          label: 'SpO2 Level',
          data: data.map(item => item.spO2),
          borderColor: '#42f57e',
          backgroundColor: 'rgba(66, 245, 126, 0.2)',
          fill: true,
          tension: 0.4
        }
      ]
    });
  }, []);

  useEffect(() => {
    // Fetch initial data from backend API
    axios.get('http://localhost:5001/api/spo2')
      .then(response => {
        const data = response.data;
        setSpO2Data(data);
        updateChartData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
        setError('Error fetching data');
        setLoading(false);
      });
  }, [updateChartData]);

  const handleSpO2Submit = (event) => {
    event.preventDefault();

    if (newSpO2 && timestamp) {
      axios.post('http://localhost:5001/api/spo2', {
        spO2: newSpO2,
        timestamp: new Date(timestamp).toISOString()
      })
      .then(response => {
        setNewSpO2('');
        setTimestamp('');
        setSpO2Data(prevData => {
          const updatedData = [...prevData, response.data];
          updateChartData(updatedData);
          return updatedData;
        });
        console.log('New SpO2 data submitted:', response.data);
      })
      .catch(error => {
        console.error("There was an error submitting the data!", error);
        setError('Error submitting data');
      });
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
      <h1>SpO2 Tracking</h1>
      <div className="chart-container">
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
                  },
                  ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10
                  }
                },
                y: {
                  beginAtZero: false,
                  title: {
                    display: true,
                    text: 'SpO2 (%)',
                    color: '#666'
                  },
                  ticks: {
                    callback: function(value) {
                      return value + '%';
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
              maintainAspectRatio: false
            }}
          />
        ) : (
          <p>No data available</p>
        )}
      </div>

      <form onSubmit={handleSpO2Submit} className="input-form">
        <div>
          <label>New SpO2 Value:</label>
          <input 
            type="number" 
            value={newSpO2}
            onChange={(e) => setNewSpO2(e.target.value)}
            min="0" 
            max="100"
          />
        </div>
        <div>
          <label>Timestamp:</label>
          <input 
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SpO2Chart;
