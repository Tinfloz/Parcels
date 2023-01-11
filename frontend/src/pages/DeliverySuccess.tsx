import { Flex, Text } from '@chakra-ui/react'
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliverySuccess: FC = () => {

    const navigate = useNavigate();

    return (
        <>
            <Flex
                justify="flex-start"
                borderBottom="1px"
                borderBottomColor="gray.300"
            >
                <Text
                    as="button"
                    fontSize="3vh"
                    color="gray.600"
                    p="2vh"
                    onClick={() => navigate("/home")}
                >
                    Home
                </Text>
            </Flex>
            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                <Text
                    as="b"
                    color="gray.300"
                    fontSize="6vh"
                >
                    Thank you for your service!
                </Text>
            </Flex>
        </>
    )
}

export default DeliverySuccess