import React, { useState} from "react";

import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer,PathLayer} from "@deck.gl/layers";
import {TripsLayer} from '@deck.gl/geo-layers';
import 'mapbox-gl/dist/mapbox-gl.css';

const mapboxToken = "pk.eyJ1IjoiamFqYW1vYSIsImEiOiJjbDhzeDI4aHgwMXh6M3hrbmVxbG9vcDlyIn0.cdD4-PP7QcxegAsxlhC3mA";
const mapStyle = "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

// Viewport settings
const viewState = {
  latitude: 42.36299487835801,
  longitude: -71.08780013311475,
  zoom: 15.2,
  minZoom: 14.5,
  maxZoom: 22,
  pitch: 30,
  bearing: -36,
};

//Tooltip
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

//Fill color
const getFillColor = (d) => {
  if(d.properties.new){
    return [251, 255, 125, 200]
  }else if (d.properties.is_project){
    return [35, 51, 82, 180]
  }else{
    return [110, 113, 117, 200]
  }
};

//Map
const KendallMap = ({floor,path,time}) => {
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
      getFillColor: d => getFillColor(d),
      pickable: true,
      autoHighlight: true,
      highlightColor: [242, 0, 117, 120],
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
      initialViewState={viewState}
      controller= {true}
      layers={layers}
      getTooltip={getTooltip}>
      <Map 
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxToken}>
      </Map>
    </DeckGL>
  );
};

export default KendallMap;
