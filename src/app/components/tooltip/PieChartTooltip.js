import * as echarts from 'echarts';
import React, { useRef, useEffect, useState } from 'react';

const PieChartTooltip = ({hoverInfo}) => {
    const chartRef = useRef(null);
    const [expectedProfit,setExpectedProfit] = useState(null);
    const [expectedEndowment,setExpectedEdowment] = useState(null);
    const [projectId, setProjectId] = useState(null);
    const [show, setShow] = useState(false);
    useEffect(() => {
      if (hoverInfo && chartRef.current && hoverInfo.object) {
        const object = hoverInfo.object;
        setExpectedEdowment(parseInt(object.properties.endowment));
        setExpectedProfit(parseInt(object.properties.profit));
        setProjectId(object.properties.unique_id);
        const building_plan = object.properties.building_plan;
        const demand_gap = object.properties.demand_gap;
        const status = object.properties.status;
        const chart = echarts.init(chartRef.current);
        const option = {
          // legend: {
          //   left: 'center',
          //   bottom: '10%',
          //   textStyle: {
          //     color: '#fff',
          //     fontSize: 10,
          //   },
          // },
          title: [
            {
              subtext: 'Demand Gap',
              left: '50%',
              top: '40%',
              textAlign: 'center',
            },
            {
              subtext: 'Built List',
              left: '50%',
              bottom: '2%',
              textAlign: 'center',
            },
          ],
          series: [
            {
              name: 'Demand Gap',
              type: 'pie',
              roseType: 'radius',
              data: demand_gap && Object.entries(demand_gap).map(([key, value]) => ({name: key, value: value})),
              radius: ['30%', '70%'],
              center: ['50%', '22%'],
              label: {
                show: true,
                formatter: '{b}:{c}', 
                position: 'inside',
                textStyle: {
                  color: '#fff',
                  fontSize: 8,
                },
            },
            labelLine: {
                show: false // Set to false to hide label lines
            },
            grid : {
              bottom: '0%',
            },
            },
            {
              name: 'Building Plan',
              type: 'pie',
              roseType: 'radius',
              data: building_plan && Object.entries(building_plan).map(([key, value]) => ({name: key, value: value})),
              radius: ['30%', '70%'],
              center: ['50%', '70%'],
              label: {
                show: true,
                formatter: '{b}:{c}', 
                position: 'inside',
                textStyle: {
                  color: '#fff',
                  fontSize: 8,
                },
            },
            labelLine: {
                show: false // Set to false to hide label lines
            },
            grid : {
              top: '0%',
            },
            },
          ],
        };
        chart.setOption(option);
        if (status == "building"|status == "built"){
          setShow(true);
        }
        return () => {
          chart.dispose(); // Dispose the chart when the component unmounts
          setShow(false);
        }
      }
    }, [hoverInfo]);
  
    return <div
    style={{
      position: 'absolute', 
      zIndex: 1, 
      pointerEvents: 'none', 
      left: hoverInfo.x, 
      top: hoverInfo.y, 
      background: "#121212",
      border: "1px solid #2C2C2C",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      borderRadius: "8px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: "700",
      fontSize: "12px",
      color: "#FFFFFF",
      textAlign: "center",
      display: show ? "block" : "none",
      // padding: "6px",
    }}>
    <h2>Project #{projectId}</h2>
    <br/>
    <p>Profit : ${expectedProfit} </p>
    <p>Endowment : ${expectedEndowment}/household</p>
    <div ref={chartRef} style={{width: '200px', height: '350px',}}></div>
    </div>
  };

  export default PieChartTooltip;
  