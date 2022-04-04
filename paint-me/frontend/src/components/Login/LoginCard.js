import {  Text, Stack, FormControl, InputGroup, InputLeftElement, Input, InputRightElement, Button, FormHelperText, Link, chakra} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {FaUserAlt, FaLock, FaEnvelope} from 'react-icons/fa';
import api from "../../api"
import { useNavigate } from "react-router-dom";

const CFaLock = chakra(FaLock);
const CFaUserAlt = chakra(FaUserAlt);
const CFaEmail = chakra(FaEnvelope);

export function LoginCard(props) {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [repPassword, setRepPassword] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    let navigate = useNavigate();

    const handleShowClick = () => setShowPassword(!showPassword);

    useEffect(() => {
        setMessage("");
    }, [props.type])

    const handleLogin = () => {
        if(username == "") {
            setMessage("Enter valid username!")
            return;
        } else if (password.length < 8) {
            setMessage("Password must be atleast 8 charactaers")
            return;
        }

        api.login(username, password, (res) => {
            if(res.errors) {
                setMessage(res.errors[0].message);
            } else {
                navigate("/dashboard")
            }
        }, (err, res) => {
            setMessage(err)
        })
    }

    const handleRegister = () => {
        
         if (password.length < 8) {
            setMessage("Password must be atleast 8 charactaers")
            return;
        } else if (username == "") {
            setMessage("Enter valid Username!")
            return;
        } else if(password != repPassword) {
            setMessage("Passwords must match!")
            return;
        }

        api.signup(username, password, (res) => {
            if(res.errors) {
                setMessage(res.errors[0].message);
            } else {
                navigate("/dashboard")
            }
        }, (err) => {
            setMessage(err)
        })
    }


    let card;
    if(props.type == "login") {
        card = <Stack
        spacing={4}
        p="1rem"
        backgroundColor="whiteAlpha.900"
        boxShadow="md"
        >
            <FormControl>
                <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                />
                <Input type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value)}}/>
                </InputGroup>
            </FormControl>
            <FormControl>
                <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                />
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                    {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                </FormHelperText>
            </FormControl>
            <Text fontSize="sm" color="tomato">{message}</Text>
            <Button
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={() => handleLogin()}
            >
                Login
            </Button>
        </Stack>
    } else if (props.type == "register") {
        card = <Stack
        spacing={4}
        p="1rem"
        backgroundColor="whiteAlpha.900"
        boxShadow="md"
        >
        
            <FormControl>
                <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                />
                <Input type="text" placeholder="Username" onChange={(e) => {setUsername(e.target.value)}}/>
                </InputGroup>
            </FormControl>
            <FormControl>
                <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                />
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                    {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl>
                <InputGroup>
                <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                />
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat Password"
                    onChange={(e) => {setRepPassword(e.target.value)}}
                />
                </InputGroup>
            </FormControl>
            <Text fontSize="sm" color="tomato">{message}</Text>
            <Button
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={() => handleRegister()}
            >
                Register
            </Button>
        </Stack>
    } 

    return (
        <form style={{"width":"70%"}}>
            {card}
        </form>
    )
}