import React, { useState, FC, ChangeEvent } from 'react';
import { Flex, Box, Text, VStack, Button, Input } from "@chakra-ui/react";
import { IUserCreds } from '../interfaces/auth.interface';

interface IUserCredProps {
    chef: boolean,
    customer: boolean,
    register: boolean
}

const UserCreds: FC<IUserCredProps> = ({ chef, customer, register }) => {

    const [creds, setCreds] = useState<IUserCreds>({
        email: "",
        password: "",
        name: "",
        userType: chef ? "Chef" : (customer ? "Customer" : "Rider")
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCreds(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            <Box
                w="50vh"
                h="50vh"
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="1vh"
            >
                <Flex
                    justify="center"
                    alignItems="center"
                    p="3vh"
                >
                    <VStack spacing="3vh">
                        <Text
                            as="b"
                            fontSize="2.5vh"
                        >
                            {
                                register ? (
                                    <>
                                        {
                                            chef ?
                                                (
                                                    "Sign up to sell!"
                                                ) :
                                                (
                                                    customer ?
                                                        (
                                                            "Sign up to a health life!"
                                                        ) :
                                                        (
                                                            "Sign up as a delivery partner"
                                                        )
                                                )
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            chef ?
                                                (
                                                    "Login to your seller account!"
                                                ) :
                                                (
                                                    customer ?
                                                        (
                                                            "Login to your account!"
                                                        ) :
                                                        (
                                                            "Login to your partner account!"
                                                        )
                                                )
                                        }
                                    </>
                                )
                            }
                        </Text>
                        <>
                            {
                                register ?
                                    (
                                        <>
                                            <Input placeholder='Enter an email' value={creds.email}
                                                name="email" onChange={handleChange}
                                            />
                                            <Input placeholder='Enter a password' value={creds.password}
                                                name="password" onChange={handleChange}
                                            />
                                            <Input placeholder='Enter an name' value={creds.name}
                                                name="name" onChange={handleChange}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <Input placeholder='Enter an email' value={creds.email}
                                                name="email" onChange={handleChange}
                                            />
                                            <Input placeholder='Enter a password' value={creds.password}
                                                name="password" onChange={handleChange}
                                            />
                                        </>
                                    )
                            }
                        </>
                        <Button>
                            {
                                register ? "Register" : "Login"
                            }
                        </Button>
                    </VStack>
                </Flex>
            </Box>
        </>
    )
}

export default UserCreds