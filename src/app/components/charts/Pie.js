import * as echarts from 'echarts';
import React, { useRef, useEffect, useState } from 'react';

const PieChart = ({width,height,data}) => {
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
            formatter: '{b}:{d}%',
            textStyle: {
                fontSize: 10
            },
        },
        toolbox: {
            show: false,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
        },
        series: [
          {
            type: 'pie',
            radius: [20, 70],
            roseType: 'radius',
            itemStyle: {
                borderRadius: 10
            },
            // color : formattedData.map(item => materialColors[item['name']]),
            label: {
                show: false,
            },
            itemStyle: {
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            data: formattedData,
          }
        ]
        };
      chart.current.setOption(option);
      }
  }, [data]);
    return <div ref={chartRef} style={{width: width, height: height}}></div>
  };

  export default PieChart;
  