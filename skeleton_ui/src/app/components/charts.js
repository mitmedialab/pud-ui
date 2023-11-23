"use client";
import { useContext, useState, useEffect } from 'react';
import styles from './charts.module.css';
import * as echarts from 'echarts';

export default function Charts() {
    useEffect(() => {
        const element = document.getElementById('radar');
        const chart = echarts.init(element);
        const options = {
            grid :{
                top:"5%",
            },
            radar: {
              indicator: [
                { name: 'Sales', max: 6500},
                { name: 'Administration', max: 16000},
                { name: 'Information Tech', max: 30000},
                { name: 'Customer Support', max: 38000},
                { name: 'Development', max: 52000},
                { name: 'Marketing', max: 25000}
              ]
            },
            series: [{
                name: 'Budget vs spending',
                type: 'radar',
                symbol: 'none',
                lineStyle: {
                width: 2,
                color: 'rgb(242, 0, 117)'
                },
                areaStyle: {
                    color: 'rgb(242, 0, 117,0.5)'
                },
                data : [
                    {
                    value : [4300, 10000, 28000, 35000, 50000, 19000],
                    name : 'Allocated Budget'
                    }
                ]
            },
        
            {
                name: 'Budget vs spending',
                type: 'radar',
                symbol: 'none',
                lineStyle: {
                    width: 2,
                    color: '#9c06f9',
                },
                // areaStyle: {
                //     color: '#9c06f95e'
                // },
                data : [
                    {
                    value : [5000, 14000, 28000, 31000, 42000, 21000],
                    name : 'Actual Spending'
                    }]
            }]
          };
        chart.setOption(options);
      }, []);

      useEffect(() => {
        const element = document.getElementById('line');
        const chart = echarts.init(element);
        const options = {
            grid:{
                top:"10%",
                bottom:"30%",
            },
            tooltip: {},
            xAxis: {
                data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            },
            yAxis: {
                show: true,
                splitLine: {
                    show: false
                }
            },
            series: [{
                name: 'Sales',
                type: 'line',
                symbol: 'none',
                color: 'rgb(242, 0, 117)',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }]
        };
        chart.setOption(options);
      }, []);
    
      const [isChartsVisible, setChartsVisibility] = useState(false);
      useEffect(() => {
        const handleMouseMove = (event) => {
            if (event.clientX > window.innerWidth-350) { // adjust this value as needed
                setChartsVisibility(true);
            } else {
                setChartsVisibility(false);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

return (
    <div className={`${styles.chartsContainer} ${isChartsVisible ? styles.show : ''}`}>
        <div className={styles.radarBox}>
            <h2> Radar Chart</h2>
            <div className={styles.radar} id="radar"></div>
        </div>
        <div className={styles.lineBox}>
            <h2> Line Chart</h2>
            <div className={styles.line} id="line"></div>
        </div>
        <div className={styles.textInfo}>
            <h3>development profit</h3>
            <h1>$123,4845,32</h1>
        </div>
    </div>
)
}