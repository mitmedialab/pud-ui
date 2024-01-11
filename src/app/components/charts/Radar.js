import * as echarts from 'echarts';
import React, { useRef, useEffect, useState } from 'react';

const RadarChart = ({width,height,data}) => {
  const chartRef = useRef(null);
  const chart = useRef(null); 
  useEffect(() => {
    if (chartRef.current) {
      chart.current = echarts.init(chartRef.current);
      }
    return () => {
      if (chart.current) {
        chart.current.dispose();
      }
      };
  }, []);
  useEffect(() => {
    if (data && chart.current) {
      const formattedData = Object.entries(data).map(([name, value]) => ({ name, value }));
      const option = {
        grid:{
            top:"10%",
            bottom:"20%",
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}',
            textStyle: {
                fontSize: 10
            },
        },
        radar: {
            indicator: [
                { name: 'Tax Revenue', max: 100,},
                { name: 'Profit', max: 100},
                { name: 'Affordbility', max: 100},
                { name: 'Proximity', max: 100},
                { name: 'Diversity', max: 100},
                { name: 'Density', max: 100}
            ],
            axisName: {
                show: true,
                fontSize:8,
            },
        },
        
        series: [{
            name: 'Urban Performance',
            type: 'radar',
            symbol: 'circle',
            symbolSize: 6,
            data: [[90, 70, 22, 31, 60, 80], [80, 50, 77, 90, 70, 80]],
            color: ['#E91E63','#2196F3'],
            emphasis: {
                areaStyle: {
                  color: 'rgba(251, 255, 125, 0.1)'
                }
            }
        }]
     }
      chart.current.setOption(option);
      }
  }, [data]);
    return <div ref={chartRef} style={{width: width, height: height}}></div>
  };

  export default RadarChart;
  