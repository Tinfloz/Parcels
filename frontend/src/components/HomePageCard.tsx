import React, { FC, useEffect } from 'react'
import { Button, Flex, Text, VStack } from '@chakra-ui/react'
import { IChef } from '../interfaces/menu.interface';
import { useNavigate } from "react-router-dom";

interface IHomePageProps {
    customer: boolean,
    nav?: string,
    chef?: IChef,
    text?: string
}

const HomePageCard: FC<IHomePageProps> = ({ customer, nav, chef, text }) => {

    const navigate = useNavigate();

    return (
        <>
            <Flex
                as={customer ? "button" : "div"}
                justify="center"
                alignItems="center"
                onClick={customer ? () => {
                    navigate(`/get/menu/${chef?._id}`)
                } : undefined}
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="1vh"
                w="40vh"
                h="20vh"
            >
                <VStack>
                    <Text
                        as={customer ? "b" : "p"}
                    >
                        {
                            customer ? (
                                chef?.userId.name
                            ) : (
                                text
                            )
                        }
                    </Text>
                    {
                        customer ? (
                            null
                        ) : (
                            <Button
                                onClick={() => navigate(nav!)}
                            >
                                Go
                            </Button>
                        )
                    }
                </VStack>
            </Flex>
        </>
    )
}

export default HomePageCard