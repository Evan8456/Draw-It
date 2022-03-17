import React, { useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Container, Heading, Flex, Box, Text } from "@chakra-ui/react";
import Fonts from "../../themes/fonts";
import './Dashboard.css'
import Carousel from "../Carousel/Carousel";
import { connect } from "react-redux";
import api from '../../api'
import { useNavigate } from 'react-router-dom';

function Dashboard(props) {
    let navigate = useNavigate();

    useEffect(() => {
        api.authenticate((res) => {
            console.log("Logged in");
        }, (err) => {
            navigate("/")
        })
    });

    return (
        <div className="temp">
            <Navbar page="dashboard"/>
            <Container  maxWidth="container.xl" marginTop="5">
                <Flex flexDirection="row">
                    <Heading size="xl" fontFamily="'Roboto Slab', serif">Welcome &nbsp;</Heading><Heading size="xl" fontFamily="'Roboto Slab', serif" color="teal">User</Heading>
                </Flex>
                <Box marginTop="3">
                    <Heading size="md" fontFamily="'Roboto Slab', serif" borderBottom="1px solid black" paddingBottom="10px" width="40%">Private Drawings</Heading>
                </Box>
                <Carousel items={props.private}/>
                <Box marginTop="4">
                    <Heading size="md" fontFamily="'Roboto Slab', serif" borderBottom="1px solid black" paddingBottom="10px" width="40%">Shared Drawings</Heading>
                </Box>
                <Carousel items={props.public}/>
            </Container>
        </div>
    )
}

const mapStateToProps = function(state) {
    return {
        private: state.dashboard.private,
        public: state.dashboard.public
    }
};

const mapDispatchToProps = function(dispatch) {
    return {
        dispatchAddPrivate: (drawings) => dispatch({type:"addPrivate", payload:drawings})
    }
}

export default connect(
    mapStateToProps, 
    null
)(Dashboard);