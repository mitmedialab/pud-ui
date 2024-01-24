"use client";
import styles from './KendallControl.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';


export default function KendallControl({
    pharseResponse,
    setTime,
    setLoading,
    setFormValues,
    formValues,
    }) {

    //Animation for traffic flow
    const [running, setRunning] = useState(false);
    const [interval, setFirstInterval] = useState(null);
    const [interval1, setSecondInterval] = useState(null);

    useEffect(() => {
        const animate = () => {
        setTime(t => {
            const newTime = (t + 1) % 100;
            return newTime;
        });
        }
        // start loop
        setFirstInterval(setInterval(animate, 100))
        return () => {clearInterval(interval)}
    },[]);

    //Animation for auto step
    useEffect(() => {
        const animate1 = () => {
            if (running) {
                stepModel();
            }
        };
        if (!running) {
        clearInterval(interval1);
        return;
        }
        setSecondInterval(setInterval(animate1, 1000));

        return () => { clearInterval(interval1);}
    }, [running]);

    //Control Buttons
    const [isActive, setIsActive] = useState(false);
    const [isResetActive, setIsRestActive] = useState(false);
    const [isSetActive, setIsSetActive] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    
    //Start 
    const startModel = (event) => {
        setIsActive(true);
        setRunning(true);  
    }
    //Stop
    const stopModel = (envent) => {
        setIsActive(false);
        setRunning(false);
    }
    //Step
    const stepModel = (event) => {
        axios.get("http://127.0.0.1:5001/step")
                .then(response => {
                    const stop = pharseResponse(response);
                    if (stop) {
                        stopModel();
                    }
                });
    }
    //Reset
    const resetModel = (event) => {
        stopModel();
        event.preventDefault();
        setIsRestActive(true);
        setLoading(true);
        axios.get('http://127.0.0.1:5001/reset')
            .then(response => {
                pharseResponse(response);
                window.location.reload();
            })
            .finally(() => {
                setLoading(false);
            }
            );
    }

    //Set
    const setModel = (event) => {
        stopModel();
        event.preventDefault();
        setIsSetActive(true);
        setLoading(true);
        axios.post('http://127.0.0.1:5001/reset',formValues)
            .then(response => {
                pharseResponse(response);
                window.location.reload();
            })
            .finally(() => {
                setLoading(false);
            }
            );
    }

    const handleChange = (event) => {
        if(event.target.id == "max_density"){formValues.project_config.max_buildable_floors = parseInt(event.target.value);}
        else if(event.target.id == "life_circle_range"){formValues.building_config.life_circle_radius = parseInt(event.target.value);}
        else {formValues.resident_config.demand_list[event.target.id] = parseInt(event.target.value);}
        setFormValues(formValues);
        console.log(formValues);
    };

    //Trigger Show
    const [isSidebarVisible, setSidebarVisibility] = useState(true);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 's') {
                setSidebarVisibility(prevIsSidebarVisible => !prevIsSidebarVisible);
            } 
        };
        document.addEventListener('keydown', handleKeyDown);
        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    //Init
    useEffect( () => {
        axios.get("http://127.0.0.1:5001/init")
        .then(response => {
            pharseResponse(response);
        });
    }, []);

    return (
        <div className={`${styles.sidebar} ${isSidebarVisible ? styles.show : ''}`}>
            <div className={styles.sidebarHeader}>
                <h1>PUB-SIM</h1>
                <p>Prosocial Urban Development</p>
            </div>
            <div className={styles.sidebarBody}>
                <h2> Control Pannel </h2>
                <form>
                    <h3>Basic Config</h3><br/>
                    <span className={styles.sliderLabel}>Max Density</span>
                    {formValues && formValues.project_config && formValues.project_config.max_buildable_floors && (
                    <input type="range" min="3" max="10" defaultValue={formValues.project_config.max_buildable_floors} step="1" className={styles.slider} id="max_density" onChange={handleChange}/>
                    )}
                    <span className={styles.sliderLabel}>Life Circle Range</span>
                    {formValues && formValues.building_config && formValues.building_config.life_circle_radius && (
                        <input type="range" min="0" max="2000" defaultValue={formValues.resident_config.life_circle_radius} step="100" className={styles.slider} id="life_circle_range" onChange={handleChange}/>
                    )}
                    <h3>Demand List</h3><br/>
                    {   
                        formValues && formValues.resident_config && formValues.resident_config.demand_list && formValues.resident_config.demand_list.map((demand, index) => {
                            return (
                                <div key={index}>
                                    <span className={styles.sliderLabel}>{formValues.amenity_list[index]}</span>
                                    <input type="range" min="0" max="1000" defaultValue={demand} step="10" className={styles.slider} id={index} onChange={handleChange}/>
                                </div>
                            )
                        })
                    }
                </form>
                <button className={styles.activeButton} id="start" onClick={startModel}>Start Model</button>
            </div>
            <div className={styles.sidebarFooter}>
                <div className={styles.left}>
                    <button className={isSetActive? styles.activeButton:styles.button} id="set" onClick={setModel}>Set Params</button>
                    <button className={styles.button} id="step" onClick={stepModel}>Step Model</button>
                </div>
                <div className={styles.right}>
                    <button className={isResetActive? styles.activeButton : styles.button} id="reset" onClick={resetModel}>Reset Params</button>
                    <button className={styles.button} id="stop" onClick={stopModel}>Stop Model</button>
                    
                </div>
                
            </div>
        </div>
    );
}
