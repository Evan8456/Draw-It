import { Container, Flex, Heading, AspectRatio, Image, Button, Spacer} from "@chakra-ui/react";
import React, { useEffect } from "react";
import NavBar from "../Navbar/Navbar";
import pencil from "../../assets/pencil.png";
import { LoginCard } from "./LoginCard";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function Login(props) {
    let navigate = useNavigate();

    useEffect(() => {
        api.authenticate((res) => {
            if(!res.errors) {
                navigate("/dashboard");
            }
        }, (err) => {
            
        });
    });

    return (
        <div className="temp">
            <NavBar page="landing" type={props.cardType}/>
            <Container maxW="container.xl">
                <Flex direction="row" align="center">
                    <Flex direction="column" align="center" display={{base:"None", md:"block"}}>
                        <AspectRatio width="100%" maxWidth='500px' ratio={1 / 1} marginTop="10%">
                            <Image src={pencil} alt='pencil' objectFit='cover' />
                        </AspectRatio>
                        <Heading size="lg" fontWeight="300" color="gray.500">Collaborate and create masterpieces with your friends!</Heading>
                    </Flex>

                    <Spacer/>

                    <Flex minW={{ base: "100%", md: "468px" }} direction="column" align="center">
                        <Heading color="teal.400">Welcome</Heading>
                        <LoginCard type={props.cardType} dispatch={props.dispatchPage}/>
                    </Flex>
                </Flex>
                <Flex alignItems={"center"} justifyContent="center">
                    <Button onClick={() => {navigate("/credits")}}>Credits</Button>
                </Flex>
            </Container> 
        </div>
    )
}

const mapStateToProps = function(state) {
    return {
        cardType: state.login.page
    }
};

const mapDispatchToProps = function(dispatch) {
    return {
        dispatchPage: (page) => dispatch({type:"CARDTYPE", payload:page})
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(Login);