import React, { useEffect, useState } from "react";
import {connect} from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import api from '../../api';
import { useNavigate } from "react-router-dom";
import validator from 'validator';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
    Select,
    Box, 
    Button, 
    Container, 
    Flex, 
    Heading, 
    Spacer, 
    chakra,
    Alert,
    AlertIcon,
    AlertDescription,
    AlertTitle
} from '@chakra-ui/react'

function NavBar(props) {
  const [warning, setWarning] = useState(false);

    let text = ""
    if(props.type === "login") {
        text = "Get Started"
    } else {
        text = "Login Now";
    }

    const changePage = () => {
        if(props.type === "login") {
            props.dispatchPage("register");
        } else {
            props.dispatchPage("login");
        }
    }

    const createDraw = (title,collab ) => {
        // santize input before calling api
        title = validator.escape(title);
        if(title !== "" && collab === "Public"){
          api.addDrawing(title, true, (res) => {
            navigate("/Draw", { state: {  id: res.data.addDrawing, load: false } });
          })
        }else if(title !== "" && collab === "Private"){
          api.addDrawing(title, false, (res) => {
            navigate("/SoloDraw", { state: {  id: res.data.addDrawing, load: false } });
          })
        }
        
    }

    const joinRoom = (roomCode) => {
        // api check to see room exists
        if(roomCode !== "" && validator.isAlphanumeric(roomCode)){
        
          api.checkRoom(roomCode, (res) => {
            if(res.data.findRoom) {
              api.checkLoad(roomCode, (res) => {
                  navigate("/Draw", {state: {id: roomCode, load:res.data.loadImage}})
              })
            } else {
              setWarning(true);
            }
          }, err => {
            console.error(err)
          })
        }
        
    }

    function signOut() {
      api.signout((res) => {
          navigate("/")
      }, (err) => {
          console.error(err);
      })
    }

    let CFaPlus = chakra(FaPlus);
  
    const { isOpen: isCollabOpen , onOpen: onCollabOpen, onClose: onCollabClose }  = useDisclosure();
    const { isOpen: isJoinRoomOpen , onOpen: onJoinRoomOpen, onClose: onJoinRoomClose }  = useDisclosure({onClose: () => {setWarning(false)}})

    const initialRef = React.useRef()
    const finalRef = React.useRef()

    const initialRef2 = React.useRef()
    const collab = React.useRef()
    const finalRef2 = React.useRef()

    const joinRoomRef = React.useRef()
    const roomCode = React.useRef()
    const finalRef3 = React.useRef()

  
    let button;
    let navigate = useNavigate()
    if(props.page === "landing") {
        button = <Button onClick={() => changePage()}>{text}</Button>
    } else if (props.page === "dashboard") {
        
      
        button = 
        <Flex flexDirection="row">
            <Box as="button"  marginLeft="3"    
            onClick={() => onCollabOpen()} 
            rounded="2xl" 
            bg="cyan.50" 
            boxShadow="md" 
            height='40px'
            lineHeight='1.2'
            transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            border='1px'
            px='8px'
            fontSize='14px'
            fontWeight='semibold'
            borderColor='#ccd0d5'
            color='#4b4f56'
            display="flex"
            flexDirection="row"
            alignItems="center"

            _hover={{ bg: 'cyan.100' }}>
                <CFaPlus color="teal"/>&nbsp;Create Room
            </Box>
        <Modal
          initialFocusRef={initialRef2}
          finalFocusRef={finalRef2}
          isOpen={isCollabOpen}
          onClose={onCollabClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create your Art</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input ref={initialRef2} placeholder='Title' />
              </FormControl>
              <FormControl>
                <FormLabel>Room Type</FormLabel>
                <Select ref={collab} placeholder='Select option'>
                   <option value='Public'>Public</option>
                   <option value='Private'>Private</option>
                  
                </Select>
              </FormControl>
  
           
            </ModalBody>
  
            <ModalFooter>
              <Button onClick={()=> createDraw(initialRef2.current.value, collab.current.value)}colorScheme='blue' mr={3}>
                Create
              </Button>
              <Button onClick={onCollabClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Box as="button"  marginLeft="3"    
            onClick={() => onJoinRoomOpen()} 
            rounded="2xl" 
            bg="cyan.50" 
            boxShadow="md" 
            height='40px'
            lineHeight='1.2'
            transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
            border='1px'
            px='8px'
            fontSize='14px'
            fontWeight='semibold'
            borderColor='#ccd0d5'
            color='#4b4f56'
            display="flex"
            flexDirection="row"
            alignItems="center"

            _hover={{ bg: 'cyan.100' }}>
                <CFaPlus color="teal"/>&nbsp;Join Room
            </Box>
        <Modal
          initialFocusRef={joinRoomRef}
          finalFocusRef={finalRef3}
          isOpen={isJoinRoomOpen}
          onClose={onJoinRoomClose}
        >
          <ModalOverlay />
          <ModalContent>
              <Alert status="error" display={warning ? "flex" : "none"}>
                <AlertIcon/>
                <AlertTitle mr={2}>Incorrect room code</AlertTitle>
              </Alert>

            <ModalHeader>Create your Art</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Room Code</FormLabel>
                <Input ref={roomCode} placeholder='Room Code' />
              </FormControl>
             
            </ModalBody>
  
            <ModalFooter>
              <Button onClick={()=> joinRoom(roomCode.current.value)}colorScheme='blue' mr={3}>
                Join
              </Button>
              <Button onClick={onJoinRoomClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

            <Button onClick={() => signOut()} marginLeft="3">Sign Out</Button>
        </Flex>
    }else if(props.page === "draw"){
      button= <Button onClick={() => signOut()}>Sign Out</Button>
    }

    return (
        <Container  maxWidth="container.xl">
            <Flex align="center">
                <Box p='2'>
                    <Heading onClick={()=> navigate("/")} size='xl'>Draw-It</Heading>
                </Box>
                <Spacer/>
                <Box>
                    {button}
                </Box>
            </Flex>
        </Container>
    )
}

const mapDispatchToProps = function(dispatch) {
    return {
        dispatchPage: (page) => dispatch({type:"CARDTYPE", payload:page})
    }
}

export default connect(
    null, 
    mapDispatchToProps
)(NavBar);