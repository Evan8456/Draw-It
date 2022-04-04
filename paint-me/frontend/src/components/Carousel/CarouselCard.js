import { Flex, Heading, Image } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CarouselCard(props) {

    const navigate = useNavigate();
    let display_title = props.title.substring(0,20);
    if(props.title.length >20){
        display_title = props.title.substring(0,20) +"...";
    }
   

    return (
        <Flex as={'button'} width={props.width} justifyContent="center" alignItems="center" flexDirection="column" boxShadow="lg" borderRadius="2xl" onClick={() => navigate(props.drawpath, {state: {id: props._id, load: true}})}>
            <Heading size="md">{display_title}</Heading>
            <Image src={props.image} alt="Drawing" height="50%" marginTop="2" marginBottom="2"/>
            
        </Flex>
    )
}