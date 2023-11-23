"use client";
import React, { useEffect,createContext,useState } from 'react';
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './map.module.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2VrZWh1cnJ5IiwiYSI6ImNsbzdncTlqaDA0aDEya3BiaWZuc3Q2dnAifQ.ln2R45SGy6_MTakR8XWnsw';

// create a mapboxgl map
export default function Map({ setMap }) {
  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: 'map',
      style: "mapbox://styles/mapbox/dark-v11",
      center: [-71.09509010405000, 42.36304218474550],
      zoom: 14.5
    });
    newMap.on("load", async () => {
      let agents_data = await fetch("http://127.0.0.1:5001/init")
                                    .then((data) => data.json()
                                    .catch((err) => console.error(err)));
  
      newMap.addSource('agents', {
        type: 'geojson',
        data: agents_data
      });
      newMap.addLayer({
        id: 'projectrange',
        type: 'line',
        source: 'agents',
        filter:  ['!=', ['get', 'line-color', ['properties']], null],
        paint: {
          'line-color': ['get', 'line-color', ['properties']],
          'line-width': ['get', 'line-width', ['properties']]
        }
      })

      newMap.addLayer({
        id: 'buildings',
        type: 'fill',
        source: 'agents',
        filter: ['==', '$type', 'Polygon'],
        paint: {
          'fill-color': ['get', 'fill-color', ['properties']],
          'fill-opacity': ['get', 'fill-opacity', ['properties']]
        }
      })

      newMap.addLayer({
        id: 'agents',
        type: 'circle',
        source: 'agents',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': ['get', 'circle-radius', ['properties']],
          'circle-color': ['get', 'circle-color', ['properties']]
        }
      });
      setMap(newMap);
    });
    return () => {
      newMap.remove();
    }
    }, []);
  return (
      <div id="map" className={styles.map}></div>
  )
}

