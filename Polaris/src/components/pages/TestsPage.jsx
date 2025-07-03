import React, { useEffect, useMemo } from 'react';
import TimeseriesChart from '../charts/TimeseriesChart.jsx';
import './TestsPage.css';
import { useTestData } from '../../hooks/dataHooks/useTestData.js';
import { getColor } from '../../utils/colourConfig.js';

const TestsPage = () => {
  // Mock data for demonstration
  const { data: testData, loading, error } = useTestData();

      const colors = useMemo(() => {
          return {
              dns: getColor(),
              pingng: getColor(),
              sms: getColor(),
              down_up: getColor(),
          }
      }, [])  

  useEffect(() => {
    
  }, [])

  return (
    <div className="tests">
      <h1>Tests Dashboard</h1>
      <div className="tests-grid">
        {/* DNS Test Section */}
        {
          testData['dns'] && 
          <section className="tests-section">
            <h2>DNS Test</h2>
              {
              testData['dns']?.map((test) => {
                return (<div style={{ flex: 1 }}>
                  <div className="tests-chart">
                    <TimeseriesChart key={test.domain} title={`DNS query for (${test.domain})`} data={test.data.map((data) => ({x: data.timestamp, y: data.result}))} label="DNS Latency (ms)" color={colors.dns} />
                  </div>
                </div>)
              })}
          </section>
        }
        {/* Ping Test Section */}
        {
          testData['ping'] &&
          
          <section className="tests-section">
            <h2>Ping Test</h2>
            {testData['ping']?.map((test) => {
                return (<div style={{ flex: 1 }}>
                  <div className="tests-chart">
                    <TimeseriesChart key={test.domain} title={`ping for (${test.domain})`} data={test.data.map((data) => ({x: data.timestamp, y: data.result}))} label="ping Latency (ms)" color={colors.ping} />
                  </div>
                </div>)
              })}
          </section>
        }
        {/* SMS Test Section */}
        {
          testData['sms'] && 
          
          <section className="tests-section">
            <h2>SMS Test</h2>
            {testData['sms']?.map((test) => {
                return (<div style={{ flex: 1 }}>
                  <div key={test.domain} className="tests-chart">
                    <TimeseriesChart title={`sms to (${test.domain})`} data={test.data.map((data) => ({x: data.timestamp, y: data.result}))} label="sms RTT (ms)" color={colors.sms} />
                  </div>
                </div>)
              })}
          </section>
        }
        {/* Download/Upload Test Section */}
        {
          ((testData['down'] && testData['down'].data != '') || (testData['up'] && testData['up'].data != '')) &&

          <section className="tests-section">
            <h2>Download/Upload Test</h2>
            <div style={{ flex: 1 }}>
                {(testData['down'] && testData['down'].data != '') && 
                  <div key={test.domain} className="tests-chart">
                    <TimeseriesChart title="Download Rate" data={testData['down'][0].map((data) => ({x: data.timestamp, y: data.result}))} label="Download (Mbps)" color={colors.down_up} />
                  </div>
                }
              {(testData['up'] && testData['up'].data != '') && 
                  <div key={test.domain} className="tests-chart">
                    <TimeseriesChart title="Upload Rate" data={testData['up'][0].map((data) => ({x: data.timestamp, y: data.result}))} label="Upload (Mbps)" color={colors.down_up} />
                  </div>
                }
            </div>
          </section>
        }

      </div>
    </div>
  );
};

export default TestsPage;
