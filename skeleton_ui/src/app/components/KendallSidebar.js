"use client";
import styles from './sidebar.module.css';
import { useContext, useState, useEffect } from 'react';

export default function KendallSidebar({setRunning}) {

    const [isActive, setIsActive] = useState(false);
    const [isRestActive, setIsRestActive] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    
    const startModel = (event) => {
        setIsActive(true);
        setRunning(true);
    }

    const stopModel = (envent) => {
        setIsActive(false);
        setRunning(false);
    }

    const restModel = async (event) => {
        setIsActive(false);
        
    }

    const [isSidebarVisible, setSidebarVisibility] = useState(true);
      useEffect(() => {
        const handleMouseMove = (event) => {
            if (event.clientX > window.innerWidth-350) { // adjust this value as needed
                setSidebarVisibility(false);
            } else {
                setSidebarVisibility(true);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className={`${styles.sidebar} ${isSidebarVisible ? styles.show : ''}`}>
            <div className={styles.sidebarHeader}>
                <h1>PUB-SIM</h1>
                <p>Prosocial Urban Development</p>
            </div>
            <div className={styles.sidebarBody}>
                <h2> Model Params</h2>
                <form>
                    <span className={styles.sliderLabel}>Population</span>
                    <input type="range" min="100" max="5000" defaultValue="1000" step="100" className={styles.slider} id="population" />
                    <span className={styles.sliderLabel}>Project Rate</span>
                    <input type="range" min="1000" max="5000" defaultValue="1500" step="100" className={styles.slider} id="range" />
                    <span className={styles.sliderLabel}>Project Id</span>
                    <input type="range" min="0" max="2" defaultValue="1" step="1" className={styles.slider} id="project_id" />
                    <span className={styles.sliderLabel}>Init Income</span>
                    <input type="range" min="1000" max="4000" defaultValue="4000" step="100" className={styles.slider} id="init_income" />
                    <span className={styles.sliderLabel}>Init Rent</span>
                    <input type="range" min="1000" max="4000" defaultValue="1000" step="100" className={styles.slider} id="init_rent" />
                </form>
            </div>
            <div className={styles.sidebarFooter}>
                <button className={isActive? styles.activeButton : styles.button} id="start" onClick={startModel}>Start</button>
                <button className={styles.button} id="stop" onClick={stopModel}>Stop</button>
                <button className={isRestActive? styles.activeButton : styles.button} id="reset" onClick={restModel}>Reset</button>
            </div>
        </div>
    );
}
