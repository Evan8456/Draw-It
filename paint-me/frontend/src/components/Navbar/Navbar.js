import { Box, Button, Container, Flex, Heading, Spacer, chakra} from "@chakra-ui/react";
import React from "react";
import {connect} from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import api from '../../api';
import { useNavigate } from "react-router-dom";
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
    useDisclosure 
} from '@chakra-ui/react'

function NavBar(props) {
    let text = ""
    if(props.type == "login") {
        text = "Get Started"
    } else {
        text = "Login Now";
    }

    const changePage = () => {
        if(props.type == "login") {
            props.dispatchPage("register");
        } else {
            props.dispatchPage("login");
        }
    }

    const createDraw = (title,collab ) => {
        console.log("Creating canvas");
        navigate("/Draw", { state: {  title: title, collaborators: collab, roomCode:null } });
    }

    const joinRoom = (roomCode) => {
        // api check to see room exists
        navigate("/Draw", { state: {  title: null, collaborators: null, roomCode:roomCode } });
    }

    const createSoloDraw = (data) => {
        navigate("/SoloDraw", { state: {  title: data } });
    }

    let CFaPlus = chakra(FaPlus);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isCollabOpen , onOpen: onCollabOpen, onClose: onCollabClose }  = useDisclosure();
    const { isOpen: isJoinRoomOpen , onOpen: onJoinRoomOpen, onClose: onJoinRoomClose }  = useDisclosure()

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
    if(props.page == "landing") {
        button = <Button onClick={() => changePage()}>{text}</Button>
    } else if (props.page == "dashboard") {

        function signOut() {
            api.signout((res) => {
                navigate("/")
            }, (err) => {
                console.log(err);
            })
        }
        button = 
        <Flex flexDirection="row">

            <Box as="button" 
            onClick={() => onOpen()} 
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
                <CFaPlus color="teal"/>&nbsp;Create Solo
            </Box>
            <Modal
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create your Art</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input ref={initialRef} placeholder='Title' />
              </FormControl>
  
           
            </ModalBody>
  
            <ModalFooter>
              <Button onClick={()=> createSoloDraw(initialRef.current.value)}colorScheme='blue' mr={3}>
                Create
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>


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
                <FormLabel>collaborators</FormLabel>
                <Input ref={collab} placeholder='Collaborators' />
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