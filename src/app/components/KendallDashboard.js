import PieChart from "./charts/Pie"
import RadarChart from "./charts/Radar";
import LineChart from "./charts/Line";
import styles from './KendallDashboard.module.css';
import {useState, useEffect, useRef, use} from 'react';

const KendallDashboard = ({collected_data}) => {  
    const [demandWeightData, setDemandWeightData] = useState([]);
    const [endowment, setEndowment] = useState(0);
    const [demandGap, setDemandGap] = useState(null);
    const [residentData, setResidentData] = useState(null);
    const [isChartsVisible, setChartsVisibility] = useState(true);
    
    useEffect(() => {
        if (collected_data.endowment){
            setEndowment(parseFloat(collected_data.endowment).toFixed(2));
        }
        if (collected_data.demand_gap){
            setDemandGap(collected_data.demand_gap);
        }
        if (collected_data.demand_weight){
            setDemandWeightData(collected_data.demand_weight);
        }
        if (collected_data.resident_profile){
            setResidentData(collected_data.resident_profile);
        }
    }, [collected_data]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'p') {
                setChartsVisibility(prevIsChartsVisible => !prevIsChartsVisible);
            } 
        };
        document.addEventListener('keydown', handleKeyDown);
        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className={`${styles.chartsContainer} ${isChartsVisible ? styles.show : ''}`}>
        <div className={styles.chartsHeader}>
            <div className={styles.left}>
                <div className={styles.pieBox}>
                    <h2>Demand Weight</h2>
                    <PieChart width={"100%"} height={"100%"} data={demandWeightData} />
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.pieBox}>
                    <h2> Resident Profile</h2>
                    {/* <RadarChart width={"100%"} height={"100%"} data={data} /> */}
                    <PieChart width={"100%"} height={"100%"} data={residentData} />
                </div>
            </div>
        </div>
        <div className={styles.lineBox}>
            <h2> Demand Gap</h2>
            <LineChart width={"100%"} height={"100%"} data={demandGap} />
        </div>
        <div className={styles.barBox}>
            <h2>Endowment ($/household)</h2>
            <h1 className={styles.largeText}>{endowment}</h1>
            <div className={styles.bar} id="bar"></div>
        </div>
    </div>
    )
}

export default KendallDashboard;