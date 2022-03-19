import React, { useState, useRef, useEffect } from "react";
import "./Draw.css";
import { useNavigate } from 'react-router-dom';
import api from "../../api"

import {io} from 'socket.io-client';

import Navbar from "../Navbar/Navbar";


export function Draw() {
  const canvasRef = useRef();
  const contextRef = useRef();
  const colorRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [thickness, setThick] = useState(null);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [s, setS] = useState(null);

  const [room, setR] = useState(null);

  let navigate = useNavigate();


  useEffect(() => {

    api.authenticate((res) => {

      const socket = io(process.env.REACT_APP_SOCKET)
      setS(socket);

      socket.on('drawing', goDraw);
      socket.on("connect", () =>{
        console.log(`connected with id :${socket.id}`);
        socket.emit('join-room',"testRoom");
        console.log(`socket join room: testRoom`);
        setR("testRoom");
      });
      
    }, (err) => {
        navigate("/")
    })

    const canvas = canvasRef.current;
    canvas.width = 600 * 2;
    canvas.height = 600 * 2;

    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = "#000000";
    context.lineWidth = 5;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;


  }, []);

  function goDraw(data){
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle= data.color;
    context.lineWidth = data.thickness;
    contextRef.current.beginPath();
    contextRef.current.moveTo(data.x0, data.y0);
    contextRef.current.lineTo(data.x1, data.y1);
    contextRef.current.stroke();
    contextRef.current.closePath();
    context.strokeStyle= colorRef.current.value;
    context.lineWidth = thickness;

  }
  function joinRoom1(){
    s.emit('join-room',"testRoom1");
    setR("testRoom1");
    clearCanvas();
    console.log(`socket join room: testRoom 1`);
  }

  function joinRoom2(){
    s.emit('join-room',"testRoom2");
    setR("testRoom2");
    clearCanvas();
    console.log(`socket join room: testRoom 2`);
  }

  function clearCanvas(){
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  const changeColor = (color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
  };

  function downloadCanvas(){
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "art.png";
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

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    console.log("currently drawing on room: " + room);
    contextRef.current.beginPath();
    contextRef.current.moveTo(startX, startY);
    const { offsetX, offsetY } = e.nativeEvent;
    setStartX(offsetX);
    setStartY(offsetY);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    s.emit('drawing', {
      x0: startX,
      y0: startY,
      x1: offsetX,
      y1: offsetY,
      color: context.strokeStyle,
      thickness: context.lineWidth

    }, room);
    
  };

  return (
    <>
      <div>
      <Navbar page="dashboard"/>
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

        <button onClick={() => joinRoom1()}>Test Room 1</button>
        <button onClick={() => joinRoom2()}>Test Room 2</button>
      </div>
    </>
  );
}


