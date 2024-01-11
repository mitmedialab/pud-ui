import React, { useState, useEffect} from "react";

import Map from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { GeoJsonLayer,IconLayer} from "@deck.gl/layers";
import {TripsLayer} from '@deck.gl/geo-layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import PieChartTooltip from "./tooltip/PieChartTooltip";
import InfoTooltip from "./tooltip/InfoTooltip";

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
//Fill color
const getFloorColor = (d) => {
  if(d.new){
    return [251, 255, 125, 200]
  }else if (d.is_project){
    return [35, 51, 82, 180]
  }else{
    return [110, 113, 117, 200]
  }
};
const getPeojectColor = (d) => {
  if(d.properties.status == "building"){
    return [242, 0, 117, 200]
  }
  else if(d.properties.status == "built"){
    return [0,150,0,parseInt(250*(1-d.properties.round/5))]
  }
  else {
    return [140, 140, 140, 250]
  }
}
//Map
const KendallMap = ({floor,project,path,time}) => {
  const [hoverInfoProject, setHoverInfoProject] = useState({});
  const [hoverInfoFloor, setHoverInfoFloor] = useState({});
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
      getFillColor: d => getFloorColor(d),
      pickable: true,
      autoHighlight: true,
      highlightColor: [242, 0, 117, 120],
      onHover: info => setHoverInfoFloor(info),
    }),
    new IconLayer({
      id: 'icon-layer',
      data : project,
      pickable: true,
      autoHighlight: true,
      highlightColor: [242, 0, 117, 255],
      onHover: info => setHoverInfoProject(info),
      iconAtlas: 'location.png',
      iconMapping: {
        marker: {x: 0, y: 0, width: 128, height: 128, mask: true}
      },
      getIcon: d => 'marker',
      sizeScale: 5,
      getPosition: d => [d.coordinates[0],d.coordinates[1],d.coordinates[2]+25],
      getSize: d => 5,
      getColor: d => getPeojectColor(d),
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
    <div>
    <DeckGL
      initialViewState={viewState}
      controller= {true}
      layers={layers}
      >
      <Map 
        mapStyle={mapStyle}
        mapboxAccessToken={mapboxToken}>
      </Map>
    </DeckGL>
    {
      hoverInfoProject && <PieChartTooltip hoverInfo={hoverInfoProject} />
    }
    {
      hoverInfoFloor && <InfoTooltip hoverInfo={hoverInfoFloor} />
    }
    </div>
  );
};

export default KendallMap;
