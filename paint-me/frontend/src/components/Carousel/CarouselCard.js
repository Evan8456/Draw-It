import { Flex, Heading, Image, chakra, IconButton } from "@chakra-ui/react";
import React from "react";
import { FaTwitter, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CarouselCard(props) {

    let Twitter = chakra(FaTwitter);
    let Download = chakra(FaDownload);
    const navigate = useNavigate();

    console.log(props)

    return (
        <Flex as={'button'} width={props.width} justifyContent="center" alignItems="center" flexDirection="column" boxShadow="lg" borderRadius="2xl" onClick={() => navigate(props.drawpath, {state: {id: props._id, load: props.path}})}>
            <Heading size="md">{props.title}</Heading>
            <Image src={props.image} alt="Drawing" height="50%" marginTop="2" marginBottom="2"/>
            <Flex justifyContent="centwe" flexDirection="row" alignItems="center">
                <IconButton variant='outline' colorScheme='teal' aria-label='Send email' icon={<Twitter />} marginRight="2"/>
                <IconButton variant='outline' colorScheme='teal' aria-label='Send email' icon={<Download />}/>
            </Flex>
        </Flex>
    )
}