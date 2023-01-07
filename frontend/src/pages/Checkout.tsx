import React, { FC, useEffect, useState } from 'react';
import { Avatar, Box, Button, Flex, HStack, IconButton, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../typed.hooks/hooks";
import { deleteOrderFromDatabase, orderMyCartItems, orderSingularItems, resetOrder, resetOrderHelpers } from '../reducers/order/order.slice';
import { IItems, IOrder } from '../interfaces/order.interface';
import { BiRupee } from "react-icons/bi";
import { BiArrowFromRight } from "react-icons/bi";
import { useNavigate } from "react-router-dom"
import { getRzpResponse, resetPayment, verifyMyPayment } from '../reducers/payment/payment.slice';
import logo from "../assets/parcels.jpeg";

interface ICheckoutProps {
    cart: boolean
};

declare global {
    interface Window {
        Razorpay?: any;
    }
}


const Checkout: FC<ICheckoutProps> = ({ cart }) => {

    console.log("reerendered")

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { order } = useAppSelector(state => state.order);
    const { rzpOrder, isSuccess, isError } = useAppSelector(state => state.payment);
    const { user } = useAppSelector(state => state.user);
    const [created, setCreated] = useState<boolean>(false)
    console.log(created, isSuccess)

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
        if (!isSuccess && !isError) {
            console.log("returned")
            return
        } else if (isSuccess && created) {
            paymentSuccessHandler();
        } else if (isError && created) {
            navigate("/home")
        }
        setCreated(false)
    }, [isSuccess, isError, navigate, created])

    const instanceOfIOrder = (param: any): param is IOrder => {
        return param.items !== undefined
    }

    const loadScript = (src: string) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const paymentSuccessHandler = async () => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            console.log("Razorpay SDK failed to load. Are you online?");
            return;
        };
        const options = {
            key: "rzp_test_rhd6Y614y0foLH",
            amount: rzpOrder.amount,
            currency: "INR",
            name: "Parcels!",
            description: "Online Purchase",
            image: { logo },
            order_id: rzpOrder.id,
            handler: async (response: any) => {
                const data = {
                    details: {
                        orderCreationId: rzpOrder.id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    },
                    id: instanceOfIOrder(order) ? order._id : null
                };
                await dispatch(verifyMyPayment(data));
                dispatch(resetPayment());
            },
            prefill: {
                name: user!.name,
                email: user!.email,
            },
            notes: {
                address: "Parcels!",
            },
            theme: {
                color: "#000",
            },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };


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
                        instanceOfIOrder(order) && await dispatch(deleteOrderFromDatabase(order._id));
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
                                            instanceOfIOrder(order) && order?.items?.map((element: IItems) => (
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
                                        {
                                            instanceOfIOrder(order) ? (
                                                <>
                                                    <Text>
                                                        <strong>Sales tax: </strong>₹{order?.salesTax}
                                                    </Text>
                                                    <Text>
                                                        <strong>Shipping fee: </strong>₹{order?.shippingFee}
                                                    </Text>
                                                    <Text>
                                                        <strong>Total: </strong>₹{order?.total}
                                                    </Text>
                                                </>
                                            ) : (
                                                null
                                            )
                                        }
                                    </Stack>

                                </Flex>
                                <Flex
                                    justify="center"
                                >
                                    <Button w="20vh"
                                        onClick={instanceOfIOrder(order) ? async () => {
                                            await dispatch(getRzpResponse(order._id));
                                            setCreated(true)
                                        } : undefined}
                                    >
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
