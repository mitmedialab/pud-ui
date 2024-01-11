import * as echarts from 'echarts';
import React, { useRef, useEffect, useState } from 'react';

const LineChart = ({width,height,data}) => {
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
        //Format data
        let formattedData = [];
        let keys = [];
        if (data.length>0){
            keys = Object.keys(data[0]);
            data.forEach(item => {
                keys.forEach(key => {
                    let series = formattedData.find(series => series.name === key);
                    if (!series){
                        series = { 
                            name: key, 
                            type: 'line', 
                            symbolSize: 6,
                            smooth: true,
                            emphasis: {
                                focus: 'series'
                            },
                            // color : materialColors[key],
                            data: [] };
                        formattedData.push(series);
                    }
                    series["data"].push(item[key])
                });
            });
        }
        const option = {
            grid:{
                top:"10%",
                bottom:"30%",
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.seriesName;
                },
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
                  saveAsImage: { show: true },
                  dataZoom: {
                    yAxisIndex: 'none'
                  },
                }
            },
            emphasis: {
            focus: 'series'
            },
            xAxis: {
                data : data.map((_, index) => `step_${index}`),
                show : true,
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 10
                    }
                },
            },
            yAxis: {
                show: true,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontSize: 10
                    }
                },
            },
            dataZoom: [
                {
                    type: 'slider', 
                    start: data.length<=8? 0: (1-6/data.length)*100,      
                    end: 100,
                    height: "0px",
                    zoomLock: true,
                },
                {
                    type: 'inside',  
                    start: data.length<=8? 0: (1-6/data.length)*100,      
                    end: 100,
                }
            ],
            series: formattedData,
            };
        chart.current.setOption(option);
        }
  }, [data]);
    return <div ref={chartRef} style={{width: width, height: height}}></div>
  };

  export default LineChart;
  