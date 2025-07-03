import { useMemo, useState } from "react";
import "./AnalyticsPage.css"
import TimeseriesChart from "../charts/TimeseriesChart";
import { useRSRPOvertime } from "../../hooks/dataHooks/useRSRPOvertime.js";
import { useRSRPvsRSRQ } from "../../hooks/dataHooks/useRSRPvsRSRQ.js";
import ScatterChart from "../charts/ScatterChart.jsx";
import PieChart from "../charts/PieChart.jsx";
import { useNetworkTypeData } from "../../hooks/dataHooks/useNetworkTypeData.js";
import { useAFRCNUsage } from "../../hooks/dataHooks/useAFRCNUsage.js";
import HistogramChart from "../charts/HistogramChart.jsx";
import { useHistogramData } from "../../hooks/dataHooks/useHistogramData.js";
import { getColor } from "../../utils/colourConfig.js";

const AnalyticsPage = () => {
    const [network_type, setNetworkType] = useState("4G")
    const [distributionMode, setDistributionMode] = useState("rssi")

    const { data: RSRPData, RSRPData_loading, RSRPData_error } = useRSRPOvertime();
    const { data: RSRPvsRSRQData, RSRPvsRSRQ_loading, RSRPvsRSRQ_error} = useRSRPvsRSRQ();
    const { data: networkTypeData, networkType_loading, networkType_error} = useNetworkTypeData();
    const { data: afrcnUsageData, afrcnUsage_loading, afrcnUsage_error} = useAFRCNUsage(network_type);
    const { data: histogramData, histogram_loading, histogram_error} = useHistogramData(distributionMode);

    const colors = useMemo(() => {
        return {
            rsrpOvertime: getColor(),
            rsrpvsrsrq: getColor(),
            histogram: getColor(),
            rsrpOvertime: getColor(),
        }
    }, [])


    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');

    return (
        <div className="tests">
            <h1 style={{marginBottom: "32px"}}>Analytical Charts</h1>
            <div style={{ flex: 1 }}>
                <div className="analytics-chart">
                    <TimeseriesChart title="RSRP Over Time" data={RSRPData} label="RSRP" color={colors.rsrpOvertime} />
                </div>
            </div>
            <div className="analytics-grid">

                <div className="tests-chart">
                    <ScatterChart title="RSRP vs RSRQ" data={RSRPvsRSRQData} labelx="RSRP" labely="RSRQ" color={colors.rsrpvsrsrq} />
                </div>

                <div className="tests-chart">
                    <HistogramChart title={`${distributionMode.toUpperCase()} Distribution`} data={histogramData} labely="Frequency" labelx={`${distributionMode.toUpperCase()}`} color={colors.histogram} />
                    <div className="config-section">
                        <label htmlFor="signal-metric" style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Signal Metric</label>
                        <select
                            id="signal-metric"
                            value={distributionMode}
                            onChange={(e) => setDistributionMode(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box', marginBottom: 12, padding: 6, borderRadius: 4, border: '1px solid var(--color-border)' }}
                        >
                            <option value={"rssi"}>RSSI</option>
                            <option value={"rsrp"}>RSRP</option>
                            <option value={"rsrq"}>RSRQ</option>
                        </select>
                    </div>
                </div>
                <div className="tests-chart">
                    <PieChart title="Network Type Usage" data={networkTypeData.data} labels={networkTypeData.labels} colors={networkTypeData.colors} />
                </div>
                {/* DNS Test Section */}
                <div className="tests-chart">
                    <PieChart title="AFRCN Usage Per Generation" data={afrcnUsageData.data} labels={afrcnUsageData.labels} colors={afrcnUsageData.colors} />
                    <div className="config-section">
                        <label htmlFor="network-type" style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Network Type</label>
                        <select
                            id="network-type"
                            value={network_type}
                            onChange={(e) => setNetworkType(e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box', marginBottom: 12, padding: 6, borderRadius: 4, border: '1px solid var(--color-border)' }}
                        >
                            <option value={"2G"}>2G</option>
                            <option value={"3G"}>3G</option>
                            <option value={"4G"}>4G</option>
                            <option value={"5G"}>5G</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default AnalyticsPage;