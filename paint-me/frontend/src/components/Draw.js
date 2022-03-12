import React, { useState, useRef, useEffect } from "react";
import "./Draw.css";
export function Draw() {
  const canvasRef = useRef();
  const contextRef = useRef();
  const colorRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [thickness, setThick] = useState(null);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600 * 2;
    canvas.height = 600 * 2;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = "#000000";
    context.lineWidth = 5;
    contextRef.current = context;


  }, []);

  const changeColor = (color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
  };

  function downloadCanvas(){
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = url;
    link.click();

  }
 

  const setThickness = (thickness) => {
    console.log(thickness);
    setThick(thickness);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = thickness;
  };

  const onMouseDown = (e ) => {
    console.log(e);
    const { offsetX, offsetY } = e.nativeEvent;
    setStartX(offsetX);
    setStartY(offsetY);
  
    setIsDrawing(true);
    // contextRef.current.beginPath();
    // contextRef.current.moveTo(offsetX, offsetY);
    // contextRef.current.lineTo(offsetX, offsetY);
    // contextRef.current.stroke();
    // contextRef.current.closePath();

  };

  const onMouseUp = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e ) => {
    if (!isDrawing) {
      return;
    }
    console.log(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(startX, startY);
    const { offsetX, offsetY } = e.nativeEvent;
    setStartX(offsetX);
    setStartY(offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    
  };

  return (
    <>
      <div>
        <h1>Lets Draw</h1>
        <canvas
          className="test"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={draw}
          ref={canvasRef}
        />
      </div>

      <div>
		<button onClick={() => downloadCanvas()}>Export to PNG</button>
        <input
          onChange={() => changeColor(colorRef.current.value)}
          ref={colorRef}
          type="color"
        />
        <input
          onChange={(event) => setThickness(event.target.value)}
          type="range"
          min="0"
          max="50"
          defaultValue="3"
          step="1"
        />

        <button onClick={() => changeColor("#FFFFFF")}>Erase</button>
      </div>
    </>
  );
}


