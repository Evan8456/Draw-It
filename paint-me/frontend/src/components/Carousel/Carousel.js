import { Flex, chakra, IconButton } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import drawing from "../../assets/draw.jpeg"
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import CarouselCard from "./CarouselCard";

export default function Carousel(props) {

    const [page, setPage] = useState(0);
    const [cards, setCards] = useState([])
    const [num, setNums] = useState(4)
    const [left, setLeft] = useState("");
    const [right, setRight] = useState("");

    useEffect(() => {
        if(page == 0) {
            setLeft("")
        } else {
            setLeft(<IconButton colorScheme='teal' icon={<LeftChev fontSize="40px"/>} onClick={() => {setPage(page-1)}}/>)
        }

        console.log((page+1)*num < props.items.length)
        if((page+1)*num < props.items.length) {
            setRight(<IconButton colorScheme='teal' icon={<RightChev fontSize="40px"/>} onClick={() => {setPage(page+1)}}/>)
        } else {
            setRight("")
        }

    }, [page, num]);

    useEffect(() => {
        if(page*num < props.items.length) {
            let card = []
            for(let i = page*num; i <Math.min((page+1)*num, props.items.length); i++) {
                if(num == 4) {
                    card.push(<CarouselCard title={props.items[i].name} image={props.items[i].drawing} key={i} width="22%"/>)
                } else if(num == 2) {
                    card.push(<CarouselCard title={props.items[i].name} image={props.items[i].drawing} key={i} width="47%"/>)
                }
            }
            setCards(card)
        }
    }, [page, num]);

    useEffect(() => {
        if(window.innerWidth > 600) {
            setNums(4)
        } else {
            setNums(2)
        }
        
        function handleResize() {
            if(window.innerWidth > 600) {
                setNums(4)
            } else {
                setNums(2)
            }
        }

        window.addEventListener('resize', handleResize)
    });

    let LeftChev = chakra(AiOutlineDoubleLeft)
    let RightChev = chakra(AiOutlineDoubleRight)

    return (
        <Flex flexDirection="row" alignItems="center" marginTop="4">
            {left}

            <Flex width="100%" justifyContent="space-around">
                {cards}
            </Flex>

            {right}
        </Flex>
    )
}