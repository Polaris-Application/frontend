import { useEffect, useState, useRef } from 'react';
import { fetchRSRPOverTime } from '../../services/dataServices/RSRPTime';

// Custom hook to fetch and auto-refresh location data
export const useRSRPOvertime = (refreshInterval = 10000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRSRPOverTime();
      setData(
        result.map((dataPoint) => ({
        x: dataPoint['timestamp'],
        y: dataPoint['rsrp']
    })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (refreshInterval > 0) {
      timerRef.current = setInterval(fetchData, refreshInterval);
      return () => clearInterval(timerRef.current);
    }
    return undefined;
  }, [refreshInterval]);

  return { data, loading, error, refetch: fetchData };
};
