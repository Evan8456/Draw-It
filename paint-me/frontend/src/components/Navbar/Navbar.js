import { Box, Button, Container, Flex, Heading, Spacer, chakra} from "@chakra-ui/react";
import React from "react";
import {connect} from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import api from '../../api';
import { useNavigate } from "react-router-dom";

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

    const createDraw = () => {
        console.log("Creating canvas");
        navigate("/draw");
    }

    let CFaPlus = chakra(FaPlus);

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
            onClick={() => createDraw()} 
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
                <CFaPlus color="teal"/>&nbsp;Create
            </Box>
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