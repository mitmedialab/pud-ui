"use client";
import {useState, useEffect, useRef} from 'react';
import styles from './KendallDashboard.module.css';
import * as echarts from 'echarts';

export default function KendallDashboard({
    incentiveHistory,
    vote_list,
    expenditureList,
    profitList
}) {
    const materialColors = {
        "workforce_housing":'#FF7043', 
        "early_career_housing":'#E91E63', 
        "executive_housing":'#009688',
        "family_housing":'#9C27B0', 
        "senior_housing":'#FFC300', 
        "office_lab":'#3F51B5', 
        "daycare":'#2196F3', 
        "phamacy":'#03A9F4', 
        "grocery":'#00BCD4', 
        "No Need":'#5D6D7E'  
    };

    //create Pie Chart
    const pie_chart = useRef(null); 
    useEffect(() => {
        // const element = document.getElementById('pie');
        // pie_chart.current = echarts.init(element);
    },[]);
    //update Pie Chart when incentive changes
    useEffect(() => {
        const formattedData = Object.entries(vote_list).map(([name, value]) => ({ name, value }));
        const options = {
            grid:{
                top:"10%",
                bottom:"20%",
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c} ({d}%)',
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
                color : formattedData.map(item => materialColors[item['name']]),
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
        if (pie_chart.current) {
            pie_chart.current.setOption(options);
        }
     }, [vote_list]);

     //create Radar Chart
    const radar_chart = useRef(null);
    useEffect(() => {
        // const element = document.getElementById('radar');
        // radar_chart.current = echarts.init(element);
    },[]);
    //update Radar Chart when incentiveHistory changes
    useEffect(() => {
        const options = {
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
        if (radar_chart.current) {
            radar_chart.current.setOption(options);
        }
    }, []);

    //create Line Chart
    const line_chart = useRef(null);
    useEffect(() => {
        // const element = document.getElementById('line');
        // line_chart.current = echarts.init(element);
    },[]);
    //update Line Chart when incentiveHistory changes  
    useEffect(() => {
        //Format incentiveHistory
        let seriesData = [];
        let keys = [];
        if (incentiveHistory.length>0){
            keys = Object.keys(incentiveHistory[0]);
            incentiveHistory.forEach(item => {
                keys.forEach(key => {
                    let series = seriesData.find(series => series.name === key);
                    if (!series){
                        series = { 
                            name: key, 
                            type: 'line', 
                            symbolSize: 6,
                            smooth: true,
                            emphasis: {
                                focus: 'series'
                            },
                            color : materialColors[key],
                            data: [] };
                        seriesData.push(series);
                    }
                    series["data"].push(item[key])
                });
            });
        }
        const options = {
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
                data : incentiveHistory.map((_, index) => `step_${index}`),
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
                    start: incentiveHistory.length<=8? 0: (1-6/incentiveHistory.length)*100,      
                    end: 100,
                    height: "0px",
                    zoomLock: true,
                },
                {
                    type: 'inside',  
                    start: incentiveHistory.length<=8? 0: (1-6/incentiveHistory.length)*100,      
                    end: 100,
                }
            ],
            series: seriesData,
            };
        if (line_chart.current) {
            line_chart.current.setOption(options);
        }
      }, [incentiveHistory]);

    //create Bar Chart
    const bar_chart = useRef(null);
    useEffect(() => {
        // const element = document.getElementById('bar');
        // bar_chart.current = echarts.init(element);
    },[]);
    //update Bar Chart when incentiveHistory changes
    useEffect(() => {
        const options = {
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
                type: 'category',
                data: profitList.map((value, index) => index),
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
            series: [
                {name: "balance", data: expenditureList, type: 'bar', color: '#2196F3'},
                {name: "profit", data: profitList, type: 'bar', color: '#E91E63'}
            ],
        }
        if (bar_chart.current) {
            bar_chart.current.setOption(options);
        }
    }, [expenditureList, profitList]);

    //Resize
    useEffect(() => {
        const handleResize = () => {
            pie_chart.current.resize();
            radar_chart.current.resize();
            line_chart.current.resize();
            bar_chart.current.resize();
        };
        window.addEventListener('resize', handleResize);
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [isChartsVisible, setChartsVisibility] = useState(true);
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
                    <h2> Voting Panel</h2>
                    <div className={styles.pie} id="pie"></div>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.pieBox}>
                    <h2> Urban Panel</h2>
                    <div className={styles.pie} id="radar"></div>
                </div>
            </div>
        </div>
        <div className={styles.lineBox}>
            <h2> Incentive Panel</h2>
            <div className={styles.line} id="line"></div>
        </div>
        <div className={styles.barBox}>
            <h2>developer Panel</h2>
            <div className={styles.bar} id="bar"></div>
        </div>
    </div>
)
}