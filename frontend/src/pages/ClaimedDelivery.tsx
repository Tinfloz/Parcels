import React, { FC, useEffect, useState, useLayoutEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { getLoginRiderDelivery, markLoginRiderDeliveryPicked, markLoginRiderOrderDelivered, resetRider, resetRiderHelpers } from '../reducers/rider/rider.slice';
import { IActiveOrder } from '../interfaces/rider.interface';
import {
    Flex, Box, Text, Card, CardHeader, CardBody, CardFooter,
    Heading, Stack, StackDivider, Button, SkeletonText, SkeletonCircle
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ClaimedDelivery: FC = () => {

    const { deliveries } = useAppSelector(state => state.rider);
    const instanceOfIActiveDelivery = (param: any): param is IActiveOrder => {
        return param.dropAddress !== undefined
    };

    const [delivered, setDelivered] = useState<string>("not delivered")

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await dispatch(getLoginRiderDelivery());
            dispatch(resetRiderHelpers());
        })()
    }, [])

    useEffect(() => {
        return () => {
            dispatch(resetRider())
        }
    }, [])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                {
                    !deliveries ? (
                        <>
                            <Text
                                as="b"
                                color="gray.500"
                                fontSize="5vh"
                            >
                                There are no active deliveries currently!
                            </Text>
                        </>
                    ) : (
                        <>
                            {
                                instanceOfIActiveDelivery(deliveries) ? (
                                    <>
                                        <Card size="lg" w="65vh">
                                            <CardHeader>
                                                <Heading size='md'>{deliveries?.orderId}</Heading>
                                            </CardHeader>

                                            <CardBody>
                                                <Stack divider={<StackDivider />} spacing='4'>
                                                    <Box>
                                                        <Heading size='xs' textTransform='uppercase'>
                                                            Pickup Address
                                                        </Heading>
                                                        <Text pt='2' fontSize='sm'>
                                                            {deliveries?.pickUpAddress?.address}
                                                        </Text>
                                                    </Box>
                                                    <Box>
                                                        <Heading size='xs' textTransform='uppercase'>
                                                            Drop Address
                                                        </Heading>
                                                        <Text pt='2' fontSize='sm'>
                                                            {deliveries?.dropAddress?.address}
                                                        </Text>
                                                    </Box>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="space-between"
                                                    >
                                                        <Button
                                                            disabled={localStorage.getItem("delivery") === "picked up" ? true : false}
                                                            onClick={async () => {
                                                                setDelivered("picked up")
                                                                localStorage.setItem("delivery", "picked up");
                                                                let orderDetails = {
                                                                    orderId: deliveries?.orderId,
                                                                    elementId: deliveries?.elementId
                                                                };
                                                                await dispatch(markLoginRiderDeliveryPicked(orderDetails));
                                                            }}
                                                            bg="purple.400"
                                                            color="white"
                                                        >
                                                            Picked Up
                                                        </Button>
                                                        <Button
                                                            bg="orange"
                                                            onClick={() => {
                                                                window.open(!localStorage.getItem("delivery") ?
                                                                    `https://maps.google.com?q=${deliveries?.pickUpAddress?.latitude},${deliveries?.pickUpAddress?.longitude}` :
                                                                    `https://maps.google.com?q=${deliveries?.pickUpAddress?.latitude},${deliveries?.pickUpAddress?.longitude}`
                                                                )
                                                            }}
                                                        >
                                                            Navigate
                                                        </Button>
                                                        <Button
                                                            bg="green.300"
                                                            onClick={async () => {
                                                                await dispatch(markLoginRiderOrderDelivered(deliveries?._id));
                                                                localStorage.removeItem("delivery");
                                                                navigate("/success")
                                                            }}
                                                        >
                                                            Delivered
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            </CardBody>
                                        </Card>
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            as="b"
                                            fontSize="4vh"
                                            color="gray.300"
                                        >
                                            There has been an error in loading this page
                                        </Text>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default ClaimedDelivery