import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { Container, Heading, Flex, Box } from "@chakra-ui/react";
import './Dashboard.css'
import Carousel from "../Carousel/Carousel";
import { connect } from "react-redux";
import api from '../../api'
import { useNavigate } from 'react-router-dom';

function Dashboard(props) {
    let navigate = useNavigate();
    const [privateDrawings, setPrivateDrawings] = useState([]);
    const [publicDrawings, setPublicDrawings] = useState([]);

    useEffect(() => {

        api.authenticate((res) => {
            if(res.errors) {
                navigate("/");
            }
        }, (err) => {
            navigate("/");
        });

        api.getPrivateDrawings((res) => {
            setPrivateDrawings(res.data.privateDrawings);
        }, (err) => {
            navigate("/");
        });

        api.getPublicDrawings((res) => {
            setPublicDrawings(res.data.publicDrawings);
        }, (err) => {
            navigate("/");
        });
    }, []);

    return (
        <div className="temp">
            <Navbar page="dashboard"/>
            <Container  maxWidth="container.xl" marginTop="5">
                <Flex flexDirection="row">
                    <Heading size="xl" fontFamily="'Roboto Slab', serif">Welcome &nbsp;</Heading>
                </Flex>
                <Box marginTop="3">
                    <Heading size="md" fontFamily="'Roboto Slab', serif" borderBottom="1px solid black" paddingBottom="10px" width="40%">Private Drawings</Heading>
                </Box>
                <Carousel items={privateDrawings} drawpath="/SoloDraw"/>
                <Box marginTop="4">
                    <Heading size="md" fontFamily="'Roboto Slab', serif" borderBottom="1px solid black" paddingBottom="10px" width="40%">Shared Drawings</Heading>
                </Box>
                <Carousel items={publicDrawings} drawpath="/draw"/>
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
        dispatchUpdatePrivate: (drawings) => dispatch({type:"updatePrivate", payload:drawings})
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(Dashboard);