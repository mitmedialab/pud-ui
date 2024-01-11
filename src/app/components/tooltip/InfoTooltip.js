import React, { useRef, useEffect, useState } from 'react';

const InfoTooltip = ({hoverInfo}) => {
    const [properties,setProperties] = useState([]);
    const [category,setCategory] = useState([]);
    const [show, setShow] = useState(false);
    useEffect(() => {
      if (hoverInfo && hoverInfo.object) {
        const object = hoverInfo.object;
        setShow(true);
        setCategory(object.properties.category);
        setProperties(Object.entries(object.properties).filter(([key, value]) => key != "category"));
        return () => {
          setShow(false);
        }
        }
    }, [hoverInfo])
    return <div
    style={{
      position: 'absolute', 
      zIndex: 1, 
      pointerEvents: 'none', 
      left: hoverInfo.x, 
      top: hoverInfo.y, 
      background: "#121212",
      border: "1px solid #2C2C2C",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      borderRadius: "8px",
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: "700",
      fontSize: "12px",
      color: "#FFFFFF",
      display: show ? "block" : "none",
      padding: "6px"
    }}>
    <h2 style = {{textAlign:"center"}}>{category}</h2>
    <br/>
    {properties.map(([key, value]) => (
        <p key={key}> {key}: {value} </p>
    ))}
    </div>
  };

  export default InfoTooltip;
  