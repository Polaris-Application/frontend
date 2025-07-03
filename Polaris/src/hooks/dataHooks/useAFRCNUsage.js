import { useEffect, useState, useRef } from 'react';
import { fetchAFRCNUsage } from '../../services/dataServices/AFRCNUsage';
import { getColor, getColorsForPie } from '../../utils/colourConfig';

// Custom hook to fetch and auto-refresh location data
export const useAFRCNUsage = (network_type, refreshInterval = 10000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const processAFRCNkData = (AFRCNData) => {
      const processedData = {
          'labels': [],
          'data': [],
          'colors': []
        };
        for(const item of AFRCNData){
            processedData['labels'].push(item['arfcn'].toString());
            processedData['data'].push(item['count']);
            processedData['colors'].push(getColorsForPie());
        }
        
        return processedData;
    }

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = processAFRCNkData(await fetchAFRCNUsage(network_type));
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
  }, [refreshInterval, network_type]);
  return { data, loading, error, refetch: fetchData };
};
