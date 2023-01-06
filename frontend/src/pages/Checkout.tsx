import React, { FC, useEffect } from 'react';
import { Avatar, Box, Button, Flex, HStack, IconButton, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../typed.hooks/hooks";
import { deleteOrderFromDatabase, orderMyCartItems, orderSingularItems, resetOrder, resetOrderHelpers } from '../reducers/order/order.slice';
import { IItems } from '../interfaces/order.interface';
import { BiRupee } from "react-icons/bi";
import { BiArrowFromRight } from "react-icons/bi";
import { useNavigate } from "react-router-dom"

interface ICheckoutProps {
    cart: boolean
}

const Checkout: FC<ICheckoutProps> = ({ cart }) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { order } = useAppSelector(state => state.order);


    useEffect(() => {
        if (cart) {
            return
        };
        (async () => {
            let orderDetails = {
                id: window.location.pathname.split("/").at(-2),
                qty: window.location.pathname.split("/").at(-1),
            };
            if (((param: any): param is { id: string, qty: string } => {
                return param.id !== undefined && param.qty !== undefined
            })(orderDetails)) {
                await dispatch(orderSingularItems(orderDetails));
                dispatch(resetOrderHelpers());
            };
        })()
    }, [])

    useEffect(() => {
        if (!cart) {
            return
        }
        (async () => {
            await dispatch(orderMyCartItems());
            dispatch(resetOrderHelpers());
        })()
    }, [])

    useEffect(() => {
        return () => {
            dispatch(resetOrder())
        }
    }, [dispatch])


    return (
        <>
            <Flex
                justify="flex-start"
                borderBottom="1px"
                borderBottomColor="gray.300"
            >
                <IconButton
                    aria-label='back'
                    icon={<BiArrowFromRight />}
                    bg="white"
                    _hover={{ bg: "white" }}
                    onClick={!order ? () => navigate(-1) : async () => {
                        await dispatch(deleteOrderFromDatabase(order?._id));
                        dispatch(resetOrderHelpers());
                        navigate(-1)
                    }}
                />
            </Flex>
            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                {
                    !order ? (
                        <>
                            <Spinner />
                        </>
                    ) : (
                        <>
                            <Box
                                w="60vh"
                                h="65vh"
                                borderRadius="1vh"
                                borderColor="gray.300"
                                borderWidth="1px"
                            >
                                <Flex
                                    justify="center"
                                    alignItems="center"
                                    p="2vh"
                                >
                                    <Text
                                        as="b"
                                        fontSize="3vh"
                                    >
                                        Checkout
                                    </Text>
                                </Flex>
                                <Flex
                                    p="5vh"
                                >
                                    <Stack direction="column">
                                        {
                                            order?.items?.map((element: IItems) => (
                                                <HStack spacing="4vh">
                                                    <Avatar
                                                        src={element?.product?.image}
                                                        name={element?.product?.item}
                                                        size="md"
                                                    />
                                                    <Text>{element?.product?.item}</Text>
                                                    <HStack>
                                                        <BiRupee />
                                                        <Text>{element?.product?.price * element?.qty}</Text>
                                                    </HStack>
                                                </HStack>
                                            ))
                                        }
                                        <Text>
                                            <strong>Sales tax: </strong>₹{order?.salesTax}
                                        </Text>
                                        <Text>
                                            <strong>Shipping fee: </strong>₹{order?.shippingFee}
                                        </Text>
                                        <Text>
                                            <strong>Total: </strong>₹{order?.total}
                                        </Text>
                                    </Stack>

                                </Flex>
                                <Flex
                                    justify="center"
                                >
                                    <Button w="20vh">
                                        Order
                                    </Button>
                                </Flex>

                            </Box>
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default Checkout