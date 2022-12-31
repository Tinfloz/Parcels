import React, { FC } from 'react';
import { Flex, HStack, Box, VStack, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Landing: FC = () => {

    const navigate = useNavigate();

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <HStack
                    spacing="3vh"
                >
                    <Box
                        w="40vh"
                        h="40vh"
                        display="grid"
                        placeItems="center"
                        borderColor="gray.300"
                        borderStyle="dashed"
                        borderWidth="1px"
                    >
                        <VStack>
                            <Text>
                                Register as a chef!
                            </Text>
                            <Button
                                onClick={() => {
                                    localStorage.setItem("type", "Chef");
                                    navigate("/register/chef")
                                }}
                            >
                                Go
                            </Button>
                        </VStack>
                    </Box>
                    <Box
                        w="40vh"
                        h="40vh"
                        display="grid"
                        placeItems="center"
                        borderColor="gray.300"
                        borderStyle="dashed"
                        borderWidth="1px"
                    >
                        <VStack>
                            <Text>
                                Register as a customer!
                            </Text>
                            <Button
                                onClick={() => {
                                    localStorage.setItem("type", "Customer");
                                    navigate("/register/customer")
                                }}
                            >
                                Go
                            </Button>
                        </VStack>
                    </Box>
                    <Box
                        w="40vh"
                        h="40vh"
                        display="grid"
                        placeItems="center"
                        borderColor="gray.300"
                        borderStyle="dashed"
                        borderWidth="1px"
                    >
                        <VStack>
                            <Text>
                                Register as a delivery partner!
                            </Text>
                            <Button
                                onClick={() => {
                                    localStorage.setItem("type", "Rider");
                                    navigate("/register/delivery/partner")
                                }}
                            >
                                Go
                            </Button>
                        </VStack>
                    </Box>
                </HStack>
            </Flex>
        </>
    )
}

export default Landing