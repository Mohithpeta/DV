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
      const responseData = response.data;

      console.log('Fetched Data:', responseData); // Inspect the data structure

      // Extract the data array from the response object
      const data = responseData.data;

      if (Array.isArray(data)) {
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
        const totalCount = responseData.totalEntries;
        setTotalPages(Math.ceil(totalCount / limit));

      } else {
        throw new Error('Data is not an array');
      }

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

  return (
    <div className="bp-chart-container">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {chartData && (
        <>
          <Line data={chartData} />
          <button onClick={handlePrevious} disabled={page <= 1}>Previous</button>
          <button onClick={handleNext} disabled={page >= totalPages}>Next</button>
        </>
      )}
      <form onSubmit={handleSubmit} className="bp-form">
        <input
          type="number"
          value={newSystolic}
          onChange={(e) => setNewSystolic(e.target.value)}
          placeholder="Systolic Pressure"
          required
        />
        <input
          type="number"
          value={newDiastolic}
          onChange={(e) => setNewDiastolic(e.target.value)}
          placeholder="Diastolic Pressure"
          required
        />
        <input
          type="datetime-local"
          value={newTimestamp}
          onChange={(e) => setNewTimestamp(e.target.value)}
          placeholder="Timestamp"
          required
        />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default BloodPressureChart;
