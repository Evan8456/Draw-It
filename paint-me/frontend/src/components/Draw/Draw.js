import React, { useState, useRef, useEffect } from "react";
import "./Draw.css";

import { useLocation, useNavigate } from 'react-router-dom';

import api from "../../api"

import {io} from 'socket.io-client';

import Navbar from "../Navbar/Navbar";
import { Box, Alert, AlertIcon} from "@chakra-ui/react";
// import {socket} from "./socket";

export function Draw() {
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
  const [variant, setVariant] = useState('success');
  const [display, setDisplay] = useState('none');
  const [text, setText] = useState('Successfully Saved');
  const [s, setSocket] = useState(null);

  //const [room, setR] = useState(null);

  let navigate = useNavigate();
  const { state } = useLocation();
  const { id, load } = state;

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET,{secure: true});
    setSocket(socket);
    api.authenticate((res) => {
      if(res.errors) {
        navigate("/");
      } else {
        
        
        console.log(socket);
        if(state.id !== null){
          socket.on('drawing', goDraw);
          console.log("sup");
          socket.on("connect", () =>{
            console.log(`connected with id :${socket.id}`);
            socket.emit('join-room',state.id);
            console.log(`socket join room: ${state.id}`);
            //setR(state.id);
          });
          socket.on("save-drawing",(sid)=>{
            console.log("trying to saving image")
            if(socket.id !== sid){
              console.log("saving image")
              saveImage(socket);
            }
            
          })
          socket.on("load-image",(sid)=>{
            console.log("trying to loading image")
            if(socket.id !== sid){
              console.log("loading image")
              loadImage();
            }
          })
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

    if(load !== "" && load!== undefined && load === true) {
      var image =new Image()
      image.onload = () => {
        canvasRef.current.getContext("2d").drawImage(image,0,0,image.width,image.height,0,0,600,600);;
      }
      if(process.env.REACT_APP_ENVIRONMENT) image.crossOrigin = "use-credentials";
      image.src =  process.env.REACT_APP_BACKEND + "/api/drawing/" + id + "?" + new Date().getTime();
    }
    return () => socket.disconnect();
  }, []);

  function loadImage(){
    var image =new Image()
    image.onload = () => {
      canvasRef.current.getContext("2d").drawImage(image,0,0,image.width,image.height,0,0,600,600);
    }
    if(process.env.REACT_APP_ENVIRONMENT === "dev"){ image.crossOrigin = "use-credentials";}
    image.src =  process.env.REACT_APP_BACKEND + "/api/drawing/" + id+ "?" + new Date().getTime();
    //image.src = "http://localhost:3002/api/drawing/624774ff88a5bf8e161b84ef/"
  }

  function goDraw(data){
    //console.log(data);
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

  function clearCanvas(){
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function saveImage(socket) {
    console.log("SAVING IMAGE RIGHT NOW")
    const canvas = canvasRef.current;
    //console.log(canvas);
    canvas.toBlob((url) => {
      //console.log(url);
      if(url) {
        api.saveImage(state.id, url, (res) => {
          
          setVariant("success")
          setDisplay("flex")
          setText("Successfully Saved")
          //const time = setTimeout(setDisplay("none"), 3000)
          console.log("PROMISE FURFILLED");
          console.log(state);
          console.log(socket);
          socket.emit('load-image-bk',state.id, socket.id);
        }, (err) => {
          setVariant("failure")
          setDisplay("flex")
          setText("Coiuld not save Image")
    
          //const time = setTimeout(setDisplay("none"), 3000)
        })
      }
    })
  }

  const changeColor = (color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
    //console.log(context.strokeStyle);
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
    //console.log(thickness);
    setThick(thickness);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = thickness;
  };

  const onMouseDown = (e ) => {
    //console.log(e);
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
    //console.log("currently drawing on room: " + room);
    contextRef.current.beginPath();
    contextRef.current.moveTo(startX, startY);
    const { offsetX, offsetY } = e.nativeEvent;
    setStartX(offsetX);
    setStartY(offsetY);
    //console.log(canvasRef.current.getContext('2d').strokeStyle);
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

    }, state.id);
    
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

          <Box as="button" 
            onClick={() => saveImage(s)} 
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
               Save
          </Box>

      </div>
      </div>
    </>
  );
}


