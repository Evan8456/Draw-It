import React, { useState, useRef, useEffect } from "react";

import "./SoloDraw.css";
import { useNavigate,useLocation } from 'react-router-dom';
import api from "../../api"
import Navbar from "../Navbar/Navbar";
import { FaPlus } from 'react-icons/fa';
import { Box, Button, chakra} from "@chakra-ui/react";


export function SoloDraw() {
  let CFaPlus = chakra(FaPlus);
  const canvasRef = useRef();
  const contextRef = useRef();
  const colorRef = useRef();
  const importImg = useRef();
  const [title, setTitle] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [img, setImg] = useState(null);
  const [thickness, setThick] = useState(null);
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);
  
  let navigate = useNavigate();
  const { state } = useLocation();
  console.log(state)
  const { id, load } = state;

  useEffect(() => {

    api.authenticate((res) => {
        if(res.errors) {
          navigate("/")
        }
      }, (err) => {
          navigate("/")
      })
    setTitle(state.title);
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

    if(load !== "" && load!== undefined && load === true) {
      var image =new Image()
      image.onload = () => {
        canvasRef.current.getContext("2d").drawImage(image,0,0,image.width,image.height,0,0,600,600);;
      }
      if(process.env.REACT_APP_ENVIRONMENT) image.crossOrigin = "use-credentials";
      image.src =  process.env.REACT_APP_BACKEND + "/api/drawing/" + id;
    }

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

  };
  

   function clearCanvas(){
     const canvas = canvasRef.current;
     const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
   }

   function saveImage() {
    const canvas = canvasRef.current;
    canvas.toBlob((url) => {
      if(url) {
        api.saveImage(id, url, (res) => {
        }, (err) => {
          console.log(err)
        })
      }
    })
  }

  function addImg(){
    if(!importImg.current.files[0]){
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let img = new Image();
    img.src = URL.createObjectURL(importImg.current.files[0]);
    setImg(img);
  }

  
  function uploadImg(){
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(img,0,0,img.width,img.height,0,0,600,600);
    importImg.current.value = null;

  }

  const onMouseUp = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e ) => {
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
    
  };

  return (
    <>
   
      <Navbar page="draw"/>  
      <div className="solo-draw">
        <div>{title}</div>
      <input type="file" ref={importImg} onChange={() => addImg()}  accept="image/png, image/jpeg"/>
      
       <Box as="button" 
            onClick={() =>  uploadImg()} 
            rounded="2xl" 
            bg="teal.50" 
            lineHeight='1.2'
            boxShadow="md" 
            height='35px'
            transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            border='1px'
            px='8px'
            fontSize='15px'
            fontWeight='semibold'
            borderColor='#ccd0d5'
            className="tools"
            width='75px'
            

            _hover={{ bg: 'green.100' }}>
               Upload
          </Box>

       <Box as="button" 
            onClick={() => clearCanvas()} 
            rounded="2xl" 
            bg="grey.50" 
            lineHeight='1.2'
            boxShadow="md" 
            height='35px'
            transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            border='1px'
            px='8px'
            fontSize='14px'
            fontWeight='semibold'
            borderColor='#ccd0d5'
            className="tools"
            width='75px'
            _hover={{ bg: 'white.100' }}>
               Clear
          </Box>

        <canvas
          className="test"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={draw}
          ref={canvasRef}
        />
        
        <div >

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
          className="tools"
          onChange={() => changeColor(colorRef.current.value)}
          ref={colorRef}
          type="color"
        />
        <input
        className="tools"
          onChange={(event) => setThickness(event.target.value)}
          type="range"
          min="0"
          max="50"
          defaultValue="3"
          step="1"
        />

        <Box as="button" 
            onClick={() => changeColor("#FFFFFF")} 
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
            onClick={() => saveImage()} 
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


