"use client";
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'
import Map from './components/map.js'
import KendallMap from './components/KendallMap.js'
import KendallSidebar from './components/KendallSidebar'
import Charts from './components/charts';
import {useContext, useEffect, useState, createContext} from 'react';

export default function Home() {
    
    const [running, setRunning] = useState(false);
  return (
    <>
    <KendallSidebar setRunning={setRunning} />
    <KendallMap running = {running}/>
    </>
  )
}



// "use client";
// import Image from 'next/image'
// import Link from 'next/link'
// import styles from './page.module.css'
// import Map from './components/map.js'
// import KendallMap from './components/KendallMap.js'
// import Sidebar from './components/sidebar'
// import Charts from './components/charts';
// import {useContext, useEffect, useState, createContext} from 'react';

// export const MapContext = createContext(null);

// export default function Home() {
//   const [map, setMap] = useState(null);
//   return (
//     <>
//     <MapContext.Provider value={map}>
//     <div> <Sidebar /> </div>
//     <div className={styles.map}> <Map setMap={setMap} /> </div>
//     <div> <Charts /> </div>
//     </MapContext.Provider>
//     </>
//   )
// }