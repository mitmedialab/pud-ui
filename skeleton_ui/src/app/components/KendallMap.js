import React, { useState, useEffect } from "react";

import Map from "react-map-gl";

import mapboxgl from "mapbox-gl";

import DeckGL from "@deck.gl/react";
import { LinearInterpolator } from "@deck.gl/core";
import { GeoJsonLayer, PolygonLayer,PathLayer, ScatterplotLayer, PointCloudLayer} from "@deck.gl/layers";
import {TripsLayer} from '@deck.gl/geo-layers';
import { DataFilterExtension } from "@deck.gl/extensions";

// import data from '../../../public/processed_bld_floors_small_more_floor.json'

const mapboxToken =
  "pk.eyJ1IjoiamFqYW1vYSIsImEiOiJjbDhzeDI4aHgwMXh6M3hrbmVxbG9vcDlyIn0.cdD4-PP7QcxegAsxlhC3mA";

// export const mapStyle = "mapbox://styles/mapbox/dark-v9";
const mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

// Viewport settings

const INITIAL_VIEW_STATE = {
  latitude: 42.36299487835801,
  longitude: -71.08780013311475,
  zoom: 15.2,
  minZoom: 14.5,
  maxZoom: 22,
  pitch: 30,
  bearing: -36,
  transitionDuration: 1000,
  transitionInterpolator: new LinearInterpolator(),
};

const getTooltip = ({ object }) => {
  let tip = "";
  if (object) {
    for(let key in object.properties) {
      tip += `<div><b>${key}:  </b>${object.properties[key]}</div>`
    }
  } 
  return (
    object && {
      html: tip,
      style: {
        background: "#121212",
        border: "1px solid #2C2C2C",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "8px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: "12px",
        color: "#FFFFFF",
      },
    }
  );
  };




const KendallMap = ({running}) => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [data, setData] = useState([]);
  const [path, setPath] = useState([]);
  const [project, setProject] = useState([]);
  const [floor, setFloor] = useState([]);

  useEffect( () => {
      fetch("http://127.0.0.1:5001/init")
      .then(response => response.json())
      .then(data => {
        setData(data);
        setPath(data.path_data);
        setProject(data.project_data);
        setFloor(data.floor_data);
      });
  }, []);

  // const [running, setRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [interval, setFirstInterval] = useState(null);
  const [interval1, setSecondInterval] = useState(null);

  useEffect(() => {
    const animate = () => {
      if (running) {
        setTime(t => {
          const newTime = (t + 1) % 100;
          return newTime;
        });
      }
    };
  
    const animate1 = () => {
        if (running) {
            fetch("http://127.0.0.1:5001/step")
              .then(response => response.json())
              .then((data) => {
                setData(data);
                // setPath(data.path_data);
                setProject(data.project_data);
                setFloor(data.floor_data);
              });
        }
    };
    if (!running) {
      clearInterval(interval);
      clearInterval(interval1);
      return;
    }
    // start loop
    setFirstInterval(setInterval(animate, 100))
    setSecondInterval(setInterval(animate1, 1000));

    return () => {clearInterval(interval);
                  clearInterval(interval1);}
  }, [running]);

  const layers = [
    new GeoJsonLayer({
      id: "geojson",
      data: floor,
      material: false,
      opacity: 0.2,
      stroked: true,
      filled: true,
      wireframe: true,
      lineWidthMinPixels: 1,
      getLineWidth: 0.5,
      lineWidthUnits: "meters",
      getFillColor: d => d.properties.new? [251, 255, 125, 200]:[110, 113, 117, 200],
      pickable: true,
      autoHighlight: true,
      highlightColor: [242, 0, 117, 120],
    }),
    new GeoJsonLayer({
      id: "project",
      data: data.project_data,
      material: false,
      opacity: 0.8,
      extruded: true,
      stroked: true,
      filled: true,
      lineWidthUnits: "meters",
      getLineWidth: 2,
      getElevation: d => d.properties.height,
      getFillColor: d => [24, 40, 79, 200],
      pickable: true,
      autoHighlight: true,
      highlightColor: [242, 0, 117, 180],
    }),
    new TripsLayer({
      id: 'trips',
      data: path,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: d => [251, 255, 125, 200],
      opacity: 0.5,
      widthMinPixels: 3,
      getLineWidth: 1,
      fadeTrail: true,
      trailLength: 10,
      currentTime: time,
    }),
  ];

  return (
    <DeckGL
      data={data}
      initialViewState={viewState}
      controller={true}
      layers={layers}
      getTooltip={getTooltip}
    >
      <Map 
        mapStyle={mapStyle}
        preventStyleDiffing={true}
        mapboxAccessToken={mapboxToken}
      />
    </DeckGL>
  );
};

export default KendallMap;
