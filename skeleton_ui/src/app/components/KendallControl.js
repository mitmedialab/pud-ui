"use client";
import styles from './KendallControl.module.css';
import axios from 'axios';
import { useState, useEffect } from 'react';


export default function KendallControl({
    pharseResponse,
    setTime,
    setFormValues,
    setLoading,
    formValues
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
                console.log(Math.max(...Object.values(formValues)));
                if (Math.max(...Object.values(formValues)) <= 0) {
                    stopModel();
                }else{
                    stepModel();
                }
            }
        };
        if (!running) {
        clearInterval(interval1);
        return;
        }
        setSecondInterval(setInterval(animate1, 1000));

        return () => { clearInterval(interval1);}
    }, [running,formValues]);

    //Panels
    const handleChange = (event) => {
        setFormValues({
            ...formValues,
            [event.target.id]: event.target.value
        });
    };

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
                    pharseResponse(response);
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
        axios.post('http://127.0.0.1:5001/reset',formValues)
            .then(response => {
                pharseResponse(response);
                window.location.reload();
            });
    }

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
                <h2> Init Incentive Intensity</h2>
                <form>
                    <span className={styles.sliderLabel}>Workforce Housing</span>
                    <input type="range" min="0" max="1" defaultValue={formValues.workforce_housing} step="0.01" className={styles.slider} id="workforce_housing" onChange={handleChange}/>
                    <span className={styles.sliderLabel}>Early Career Housinge</span>
                    <input type="range" min="0" max="1" defaultValue={formValues.early_career_housing} step="0.01" className={styles.slider} id="early_career_housinge" onChange={handleChange}/>
                    <span className={styles.sliderLabel}>Executive Housing</span>
                    <input type="range" min="0" max="1" defaultValue={formValues.executive_housing} step="0.01" className={styles.slider} id="executive_housing" onChange={handleChange}/>
                    <span className={styles.sliderLabel}>Family Housing</span>
                    <input type="range" min="0" max="1" defaultValue={formValues.family_housing} step="0.01" className={styles.slider} id="family_housing" onChange={handleChange}/>
                    <span className={styles.sliderLabel}>Senior Housing</span>
                    <input type="range" min="0" max="1" defaultValue={formValues.senior_housing} step="0.01" className={styles.slider} id="senior_housing" onChange={handleChange}/>
                    <span className={styles.sliderLabel}>Office/lab</span>
                    <input type="range" min="0" max="1" defaultValue={formValues.office_lab} step="0.01" className={styles.slider} id="office_lab" onChange={handleChange}/>
                    <span className={styles.sliderLabel}>Daycare</span>
                    <input type="range" min="0" max="1" defaultValue={formValues.daycare} step="0.01" className={styles.slider} id="daycare" onChange={handleChange}/>
                    <span className={styles.sliderLabel}>Phamacy</span>
                    <input type="range" min="0" max="1" defaultValue={formValues.phamacy} step="0.01" className={styles.slider} id="phamacy" onChange={handleChange}/>
                    <span className={styles.sliderLabel}>Grocery</span>
                    <input type="range" min="0" max="1" defaultValue={formValues.grocery} step="0.01" className={styles.slider} id="grocery" onChange={handleChange}/>
                </form>
                <button className={styles.activeButton} id="start" onClick={startModel}>Start</button>
            </div>
            <div className={styles.sidebarFooter}>
                <div className={styles.left}>
                    <button className={isSetActive? styles.activeButton:styles.button} id="set" onClick={setModel}>Set</button>
                    <button className={styles.button} id="stop" onClick={stopModel}>Stop</button>
                </div>
                <div className={styles.right}>
                    <button className={styles.button} id="step" onClick={stepModel}>Step</button>
                    <button className={isResetActive? styles.activeButton : styles.button} id="reset" onClick={resetModel}>Reset</button>
                </div>
                
            </div>
        </div>
    );
}
