import React, { useState, useRef, useEffect } from "react";
import "./Draw.css";
import { useNavigate,useLocation } from 'react-router-dom';
import api from "../../api"

import {io} from 'socket.io-client';

import Navbar from "../Navbar/Navbar";
import { Box, Button, chakra} from "@chakra-ui/react";


export function Draw() {
  const {state} = useLocation();
  const [title, setTitle] = useState(null);
  const [collaborators, setCollaborators] = useState(null);
  const canvasRef = useRef();
  const contextRef = useRef();
  const colorRef = useRef();
  const thickRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [thickness, setThick] = useState(null);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [s, setS] = useState(null);

  const [room, setR] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {

    api.authenticate((res) => {
      if(res.errors) {
        navigate("/");
      } else {
        const socket = io(process.env.REACT_APP_SOCKET,{secure: true})
        setS(socket);
        
        if(state.roomCode !== null){
          socket.on('drawing', goDraw);
          socket.on("connect", () =>{
            console.log(`connected with id :${socket.id}`);
            socket.emit('join-room',state.roomCode);
            console.log(`socket join room: ${state.roomCode}`);
            setR(state.roomCode);
          });
        }else{

        socket.on('drawing', goDraw);
        socket.on("connect", () =>{
          console.log(`connected with id :${socket.id}`);
          socket.emit('join-room',"testRoom");
          console.log(`socket join room: testRoom`);
          setR("testRoom");
        });
      }
      }
    }, (err) => {
      navigate("/");
    })
    setCollaborators(state.collaborators);
    setTitle(state.title);
    const canvas = canvasRef.current;
    canvas.width = 600 * 2;
    canvas.height = 600 * 2;
    
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = "#000000";
    context.lineWidth = 5;
    colorRef.current.value = "#000000";
    thickRef.current.value = 5;
    
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
    context.lineWidth = thickRef.current.value;

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
    console.log(context.strokeStyle);
  };

  function makeErase(){
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = "#FFFFFF";
    colorRef.current.value = "#FFFFFF";
  }

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
    console.log(canvasRef.current.getContext('2d').strokeStyle);
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
    
      
      <Navbar page="draw"/>
      <div>{title}</div>
      <div className="draw">
        <canvas
          className="test"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={draw}
          ref={canvasRef}
        />
      
      <div>
      <Box as="button" 
            onClick={() => downloadCanvas()} 
            rounded="2xl" 
            bg="green.50" 
            height='40px'
            transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            border='1px'
            px='8px'
            fontSize='14px'
            fontWeight='semibold'
            borderColor='#ccd0d5'
            className="tools"
            width='120px'

            _hover={{ bg: 'green.100' }}>
               Export to PNG
          </Box>

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
          ref={thickRef}
        />
        <Box as="button" 
            onClick={() => makeErase()} 
            rounded="2xl" 
            bg="red.50" 
            boxShadow="md" 
            height='35px'
            lineHeight='1.2'
            transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            border='1px'
            px='8px'
            fontSize='14px'
            fontWeight='semibold'
            borderColor='#ccd0d5'
            className="tools"
            width='75px'
            _hover={{ bg: 'red.100' }}>
               Eraser
          </Box>

        <button onClick={() => joinRoom1()}>Test Room 1</button>
        <button onClick={() => joinRoom2()}>Test Room 2</button>
      </div>
      </div>
    </>
  );
}


