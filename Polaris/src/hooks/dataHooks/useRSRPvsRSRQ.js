import { useEffect, useState, useRef } from 'react';
import { fetchRSRPvsRSRQ } from '../../services/dataServices/RSRPvsRSRQ';

// Custom hook to fetch and auto-refresh location data
export const useRSRPvsRSRQ = (refreshInterval = 10000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchRSRPvsRSRQ();
      setData(
        result.map((dataPoint) => ({
        x: dataPoint['rsrp'],
        y: dataPoint['rsrq']
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
