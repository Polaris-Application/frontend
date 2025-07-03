import { useEffect, useState, useRef, useMemo } from 'react';
import { fetchRSRPvsRSRQ } from '../../services/dataServices/RSRPvsRSRQ';
import { fetchTests } from '../../services/dataServices/tests';
import { getColor } from '../../utils/colourConfig';

// Custom hook to fetch and auto-refresh location data
export const useTestData = (refreshInterval = 10000) => {

    const testNames = [
    'ping',
    'dns',
    'sms',
    'up',
    'down',
    'web'
    ]

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const timerRef = useRef(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            
            let availableDomainsPerTest = {}
            for(let testName of testNames){
                const availableDomainsStr = (await fetchTests(testName))
                if (availableDomainsStr == "")
                    continue;
                const availableDomains = availableDomainsStr.split(',');
                availableDomainsPerTest[testName] = availableDomains;
            }
            
            let testData = {}
            for(let testName of testNames){
                if(testName in availableDomainsPerTest){
                    const tests = [];
                    for(let domain of availableDomainsPerTest[testName]){
                        const data = await fetchTests(testName, domain)
                        tests.push({
                            domain: domain,
                            data: data,
                        });
                    }
                    testData[testName] = tests;
                }
            }
            
            setData(testData)
        } catch (err) {
            console.log(err)
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
