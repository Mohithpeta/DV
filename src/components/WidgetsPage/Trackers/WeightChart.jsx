import { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import './weightchart.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeightChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weight, setWeight] = useState('');
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');
  const [weightData, setWeightData] = useState([]);
  const [weekStart, setWeekStart] = useState('');
  const [weekEnd, setWeekEnd] = useState('');

  // Sample data for testing in case of backend failure
  const sampleData = [
    { weight: 70, timestamp: '2024-09-08T00:00:00Z' },
    { weight: 71, timestamp: '2024-09-09T00:00:00Z' },
    { weight: 70.5, timestamp: '2024-09-10T00:00:00Z' },
    { weight: 72, timestamp: '2024-09-11T00:00:00Z' },
    { weight: 71.5, timestamp: '2024-09-12T00:00:00Z' },
    { weight: 70, timestamp: '2024-09-13T00:00:00Z' },
    { weight: 69.5, timestamp: '2024-09-14T00:00:00Z' }
  ];

  // Update chart data with sorted data
  const updateChartData = useCallback((data) => {
    const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const labels = sortedData.map(item => daysOfWeek[new Date(item.timestamp).getDay()]);
    const weights = sortedData.map(item => item.weight);

    setChartData({
      labels: labels,
      datasets: [
        {
          label: 'Weight Progress (Bar)',
          data: weights,
          backgroundColor: 'rgba(66, 245, 126, 0.2)',
          borderColor: '#42f57e',
          borderWidth: 1,
          type: 'bar'
        },
        {
          label: 'Weight Trend (Line)',
          data: weights,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          type: 'line'
        }
      ]
    });
  }, []);

  // Update week start and end dates based on the latest data
  const updateWeekRange = (data) => {
    if (data.length === 0) return;

    const latestDate = new Date(Math.max(...data.map(item => new Date(item.timestamp))));
    const weekStartDate = new Date(latestDate);
    weekStartDate.setDate(latestDate.getDate() - latestDate.getDay() + 1); // Monday
    const weekEndDate = new Date(latestDate);
    weekEndDate.setDate(latestDate.getDate() - latestDate.getDay() + 7); // Sunday
    setWeekStart(weekStartDate.toLocaleDateString());
    setWeekEnd(weekEndDate.toLocaleDateString());
  };

  // Fetch data from backend or use sample data if error
  useEffect(() => {
    axios.get('http://localhost:5000/api/weightdata')
      .then(response => {
        const data = response.data;
        setWeightData(data);
        updateChartData(data);
        updateWeekRange(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data", error);
        setError('Error fetching data');
        setWeightData(sampleData); // Use sample data
        updateChartData(sampleData);
        updateWeekRange(sampleData);
        setLoading(false);
      });
  }, [updateChartData]);

  // Handle form submit for adding new weight
  const handleWeightSubmit = (event) => {
    event.preventDefault();
    if (weight && day && date) {
      const timestamp = new Date(date).toISOString(); // Use date for timestamp

      axios.post('http://localhost:5000/api/weight', { weight, day, timestamp })
        .then(response => {
          const updatedData = [...weightData, response.data];
          setWeightData(updatedData);
          updateChartData(updatedData);
          updateWeekRange(updatedData);
          setWeight('');
          setDay('');
          setDate('');
        })
        .catch(error => {
          console.error("Error submitting data", error);
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
      <h1>Weekly Weight Progress</h1>
      <div className="chart-container">
        {chartData ? (
          <>
            <h3>{`Week Start: ${weekStart} - Week End: ${weekEnd}`}</h3>
            <Line 
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Day of the Week',
                      color: '#666'
                    },
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 7
                    }
                  },
                  y: {
                    min: 45, // Set a reasonable minimum to prevent excessive scaling
                    max: 150, // Set a reasonable maximum for the weight range
                    title: {
                      display: true,
                      text: 'Weight (kg)',
                      color: '#666'
                    },
                    ticks: {
                      callback: (value) => `${value}kg`
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
                }
              }}
            />
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <form onSubmit={handleWeightSubmit} className="form">
        <label>
          Weight (kg):
          <input 
            type="number" 
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="0" 
            max="150"
            required
          />
        </label>
        <label>
          Day of the Week:
          <select 
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          >
            <option value="">Select Day</option>
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </label>
        <label>
          Date:
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default WeightChart;
