import { useEffect, useState, useRef } from 'react';
import { fetchNetworkTypeData } from '../../services/dataServices/networkData';
import { getColor } from '../../utils/colourConfig';

// Custom hook to fetch and auto-refresh location data
export const useNetworkTypeData = (refreshInterval = 10000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const processNetworkData = (networkData) => {
    const processedData = {
        'labels': [],
        'data': [],
        'colors': []
    };

    for(const item of networkData){
        processedData['labels'].push(item['network_type']);
        processedData['data'].push(item['count']);
        processedData['colors'].push(getColor());
    }
    return processedData;
  }


  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = processNetworkData(await fetchNetworkTypeData());
      setData({
        labels: result['labels'],
        data: result['data'],
        colors: result['colors']
      });
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
