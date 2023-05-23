import React, { useState, useRef, useEffect } from "react";
import "./Draw.css";

import { useLocation, useNavigate } from 'react-router-dom';

import api from "../../api";

import {io} from 'socket.io-client';
import Navbar from "../Navbar/Navbar";
import { Box, Alert, AlertIcon, useClipboard, Button, Flex, AlertDescription, AlertTitle, CloseButton } from "@chakra-ui/react";

export function Draw() {
  const canvasRef = useRef();
  const contextRef = useRef();
  const colorRef = useRef();
  const thickRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  const [s, setSocket] = useState(null);
  const [status, setStatus] = useState("success");
  const [warning, setWarning] = useState("Successfully Saved!");
  const [desc, setDesc] = useState("");
  const [open, setOpen] = useState(false);
   

  let navigate = useNavigate();
  const { state } = useLocation();
  const { id, load } = state;
  const { onCopy } = useClipboard(id);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET,{secure: true});
    setSocket(socket);
    api.authenticate((res) => {
      if(res.errors) {
        navigate("/");
      } else {
        
        
        if(state.id !== null){
          socket.on('drawing', goDraw);
          
          socket.on("connect", () =>{
         
            socket.emit('join-room',state.id);
          });
          socket.on("save-drawing",(sid)=>{
            
            if(socket.id !== sid){
              
              saveImage(socket);
            }
            
          });
          socket.on("load-image",(sid)=>{
            
            if(socket.id !== sid){
              
              loadImage();
            }
          });
        }
        
      }
    }, (err) => {
      navigate("/");
    });
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
      var image =new Image();
      image.onload = () => {
        canvasRef.current.getContext("2d").drawImage(image,0,0,image.width,image.height,0,0,600,600);
      };
      if(process.env.REACT_APP_ENVIRONMENT) image.crossOrigin = "use-credentials";
      image.src =  process.env.REACT_APP_BACKEND + "/api/drawing/" + id + "?" + new Date().getTime();
    }
    return () => socket.disconnect();
  }, []);

  function loadImage(){
    var image =new Image();
    image.onload = () => {
      canvasRef.current.getContext("2d").drawImage(image,0,0,image.width,image.height,0,0,600,600);
    };
    if(process.env.REACT_APP_ENVIRONMENT === "dev"){ image.crossOrigin = "use-credentials";}
    image.src =  process.env.REACT_APP_BACKEND + "/api/drawing/" + id+ "?" + new Date().getTime();
    //image.src = "http://localhost:3002/api/drawing/624774ff88a5bf8e161b84ef/"
  }

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

  function saveImage(socket) {
    const canvas = canvasRef.current;

    canvas.toBlob((url) => {

      if(url) {
        api.saveImage(state.id, url, (res) => {
          
          setStatus("success");
          setWarning("Image Saved!");
          setDesc("");
          setOpen(true);
         
          socket.emit('load-image-bk',state.id, socket.id);
        }, (err) => {
          setStatus("warning");
          setWarning("Could not Save!");
          setDesc(err);
          setOpen(true);
    
          //const time = setTimeout(setDisplay("none"), 3000)
        });
      } else {
        setStatus("warning");
        setWarning("Could not Save!");
        setDesc("");
        setOpen(true);
      }
    });
  }

  const changeColor = (color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
    
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
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineWidth = thickness;
  };

  const onMouseDown = (e ) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setStartX(offsetX);
    setStartY(offsetY);
  
    setIsDrawing(true);


  };

  const onTouchDown = (e ) => {
    const { clientX, clientY } = e.nativeEvent.touches[0];
    setStartX(clientX);
    setStartY(clientY);
  
    setIsDrawing(true);


  };




  const onMouseUp = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const onTouchUp = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
   
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

    }, state.id);
    
  };


  
  const touchdraw = (e) => {
    if (!isDrawing) {
      return;
    }
   
    contextRef.current.beginPath();
    contextRef.current.moveTo(startX, startY);
    const { clientX, clientY } = e.nativeEvent.touches[0];
    setStartX(clientX);
    setStartY(clientY);
    
    contextRef.current.lineTo(clientX, clientY);
    contextRef.current.stroke();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    s.emit('drawing', {
      x0: startX,
      y0: startY,
      x1: clientX,
      y1: clientY,
      color: context.strokeStyle,
      thickness: context.lineWidth

    }, state.id);
    
  };

  return (
    <>
      
      <Navbar page="draw"/>

      <Alert status={status} display={open ? "flex" : "none"}>
        <AlertIcon/>
        <AlertTitle mr={2}>{warning}</AlertTitle>
        <AlertDescription>{desc}</AlertDescription>
        <CloseButton position='absolute' right='8px' top='8px' onClick={() => { setOpen(false) }}/>
      </Alert>

      
      <Flex flexDirection={"row"} alignItems="center" width="100%" justifyContent={"center"}>
      <h1>Room Code:</h1>
      </Flex>
      <Flex flexDirection={"row"} alignItems="center" width="100%" justifyContent={"center"}>
        <h1>{state.id}</h1>
        <Button onClick={onCopy} ml={2}> Copy</Button>
      </Flex>

      <div className="draw">
        <canvas
          className="test"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={draw}
          onTouchStart={onTouchDown}
          onTouchEnd={onTouchUp}
          onTouchMove={touchdraw}
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
          className="tools"
        />
        <input
          onChange={(event) => setThickness(event.target.value)}
          className="tools"
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
            bg="green.50" 
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


