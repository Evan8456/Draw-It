import React, {} from "react";
import {Container, Flex, Box, Heading} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

export default function Credits() {
    let navigate = useNavigate();

    return (
        <>
            <Container  maxWidth="container.xl">
                <Flex align="center">
                    <Box p='2'>
                        <Heading onClick={()=> navigate("/")} size='xl'>Draw-It</Heading>
                    </Box>
                </Flex>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <Heading size={"3xl"}>Credits</Heading>
                    <ul>
                    <li>Help from <a href="https://stackoverflow.com/" title="Stack Overflow" style={{"textDecoration":"underline"}}>Stack Overflow</a> for the understanding of various concepts from <a href="https://stackoverflow.com/" style={{"textDecoration":"underline"}} title="Stack Overflow">www.stackoverflow.com</a></li>
                    <li>Guide for <a href="https://www.youtube.com/watch?v=oykl1Ih9pMg&list=PL5VxYCKO5AyjGI3N0q8jvcZB5hTuxmQJa&index=1&t=919s" style={{"textDecoration":"underline"}}>Node.js deployement</a></li>
                    <li>Guide for deployement to <a href="https://www.youtube.com/watch?v=oykl1Ih9pMg&list=PL5VxYCKO5AyjGI3N0q8jvcZB5hTuxmQJa&index=1&t=919s" style={{"textDecoration":"underline"}}>Digital Ocean</a></li>
                    <li>Guide for <a href="https://www.youtube.com/watch?v=16bHGKe1QqY&list=PLpPqplz6dKxXICtNgHY1tiCPau_AwWAJU&ab_channel=PedroTech" style={{"textDecoration":"underline"}}>Graphql</a></li>
                    <li>Guide for using <a href="https://blog.telzee.io/a-simple-whiteboard-with-canvas-api-and-react/?fbclid=IwAR1hsVacgkJXXzVSAsv9XtMWbQRrLRNhULWcJSold3Ho_NegVjJkoxMBC9g" style={{"textDecoration":"underline"}}>canvas</a> with react</li>
                    <li><a href="https://graphql.org/learn/" style={{"textDecoration":"underline"}}>GraphQL Documentation</a></li>
                    <li><a href="https://chakra-ui.com/guides/first-steps" style={{"textDecoration":"underline"}}>Chakra UI Documentation</a></li>
                    <li><a href="https://reactjs.org/docs/getting-started.html" style={{"textDecoration":"underline"}}>React Documentation</a></li>
                    <li><a href="https://socket.io/docs/v4/" style={{"textDecoration":"underline"}}>Socket.io Documentation</a></li>
                    </ul>
                    <Heading size={"3xl"}>Assets</Heading>
                    <ul>
                    <li>New <a href="https://www.vhv.rs/viewpic/TRixohw_brand-new-sticker-png-transparent-png/" title="Stack Overflow" style={{"textDecoration":"underline"}}>Image</a> from <a href="https://www.vhv.rs/" style={{"textDecoration":"underline"}} title="Stack Overflow">vhv</a></li>
                    <li><a href="https://www.freeiconspng.com/img/643" style={{"textDecoration":"underline"}}>Pencil Clip Art</a> from free icons png at <a href="https://www.freeiconspng.com/img/643" style={{"textDecoration":"underline"}}>/www.freeiconspng.com</a></li>
                    <li>Icons by <a href="https://react-icons.github.io/react-icons/" style={{"textDecoration":"underline"}}>React icons</a> at <a href="https://react-icons.github.io/" style={{"textDecoration":"underline"}}>www.react-icons.github.io</a></li>
                    </ul>
                </Flex>
            </Container>
        </>
    )
}