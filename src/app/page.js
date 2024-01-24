"use client";
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import KendallMap from './components/KendallMap.js'
import KendallControl from './components/KendallControl'
import KendallDashboard from './components/KendallDashboard';
import KendallLoading from './components/KendallLoading';
import {useState} from 'react';

export default function Home() {
    const [path, setPath] = useState([]);
    const [floor, setFloor] = useState([]);
    const [project, setProject] = useState([]);
    const [time, setTime] = useState(0);
    const [formValues, setFormValues] = useState({});
    const [collected_data, setCollectedData] = useState([]);
    const [loading, setLoading] = useState(false);

    const pharseResponse = (response) => {
      const data = response.data;
      setFloor(data.floor_data);
      setProject(data.project_data);
      setPath(data.path_data);
      setCollectedData(data.collected_data)
      setFormValues(data.config_data);
      return data.stop
    }

  return (
    <>
    <KendallControl 
    pharseResponse = {pharseResponse}
    setTime={setTime} 
    setFormValues={setFormValues}
    setLoading={setLoading}
    formValues={formValues}
    />
    <KendallMap 
    floor={floor} 
    project={project}
    path={path} 
    time={time}/>
    <KendallLoading 
    loading={loading}
    />
    <KendallDashboard 
    collected_data={collected_data}
    />
    </>
    
  )
}
