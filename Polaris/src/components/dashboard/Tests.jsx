import React from 'react';
import TimeseriesChart from './TimeseriesChart';
import './Tests.css';

const mockData = (n, min, max) => Array.from({ length: n }, (_, i) => ({ x: Date.now() - (n - i) * 60000, y: Math.random() * (max - min) + min }));

const Tests = () => {
  // Mock data for demonstration
  const dnsData1 = mockData(30, 10, 50);
  const dnsData2 = mockData(30, 20, 60);
  const pingData1 = mockData(30, 30, 100);
  const pingData2 = mockData(30, 40, 120);
  const smsData1 = mockData(30, 0, 1);
  const downloadData = mockData(30, 10, 100);
  const uploadData = mockData(30, 5, 50);

  return (
    <div className="tests">
      <h1>Tests Dashboard</h1>
      <div className="tests-grid">
        {/* DNS Test Section */}
        <section className="tests-section">
          <h2>DNS Test</h2>
          <div style={{ flex: 1 }}>
            <div className="tests-chart">
              <TimeseriesChart title="DNS Timeseries Chart 1" data={dnsData1} label="DNS Latency (ms)" color="#36a2eb" />
            </div>
            <div className="tests-chart">
              <TimeseriesChart title="DNS Timeseries Chart 2" data={dnsData2} label="DNS Success Rate" color="#4bc0c0" />
            </div>
          </div>
        </section>
        {/* Ping Test Section */}
        <section className="tests-section">
          <h2>Ping Test</h2>
          <div style={{ flex: 1 }}>
            <div className="tests-chart">
              <TimeseriesChart title="Ping Timeseries Chart 1" data={pingData1} label="Ping (ms)" color="#ff6384" />
            </div>
            <div className="tests-chart">
              <TimeseriesChart title="Ping Timeseries Chart 2" data={pingData2} label="Ping Jitter (ms)" color="#ff9f40" />
            </div>
          </div>
        </section>
        {/* SMS Test Section */}
        <section className="tests-section">
          <h2>SMS Test</h2>
          <div style={{ flex: 1 }}>
            <div className="tests-chart">
              <TimeseriesChart title="SMS Timeseries Chart 1" data={smsData1} label="SMS Success" color="#9966ff" />
            </div>
          </div>
        </section>
        {/* Download/Upload Test Section */}
        <section className="tests-section">
          <h2>Download/Upload Test</h2>
          <div style={{ flex: 1 }}>
            <div className="tests-chart">
              <TimeseriesChart title="Download Timeseries Chart" data={downloadData} label="Download (Mbps)" color="#00c853" />
            </div>
            <div className="tests-chart">
              <TimeseriesChart title="Upload Timeseries Chart" data={uploadData} label="Upload (Mbps)" color="#ffd600" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Tests;
