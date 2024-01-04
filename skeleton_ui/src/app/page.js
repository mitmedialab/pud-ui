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
    const [time, setTime] = useState(0);
    const [formValues, setFormValues] = useState({});
    const [incentiveHistory, setIncentiveHistory] = useState([]);
    const [voteList, setVoteList] = useState({});
    const [expenditureList, setExpenditureList] = useState([]);
    const [profitList, setProfitList] = useState([]);
    const [loading, setLoading] = useState(false);

    const pharseResponse = (response) => {
      const data = response.data;
      setFloor(data.floor_data);
      setPath(data.path_data);
      // setFormValues(data.collected_data.incentive[data.collected_data.incentive.length-1]);
      // setIncentiveHistory(data.collected_data.incentive);
      // setVoteList(data.collected_data.vote_list);
      // setExpenditureList(data.collected_data.expenditures);
      // setProfitList(data.collected_data.profits);
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
    path={path} 
    time={time}/>
    <KendallLoading 
    loading={loading}
    />
    </>
    
  )
}
