import { Flex, Spinner, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, FC } from 'react'
import MyOrderCard from '../components/MyOrderCard';
import { ISingleMyOrder } from '../interfaces/order.interface';
import { getAllMyOrders, resetOrderHelpers } from '../reducers/order/order.slice';
import { useAppSelector, useAppDispatch } from '../typed.hooks/hooks'

const MyOrders: FC = () => {

    const dispatch = useAppDispatch();
    const { order } = useAppSelector(state => state.order);

    useEffect(() => {
        (async () => {
            await dispatch(getAllMyOrders());
            dispatch(resetOrderHelpers())
        })()
    }, [dispatch])

    const instanceOfIArraySingleOrderItem = (param: any): param is Array<ISingleMyOrder> => {
        return param.length !== undefined && param.length !== 0 && param[0].items !== undefined
    }

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                {
                    !order ? (
                        <>
                            <Spinner
                                speed='0.65s'
                                color='blue.500'
                                emptyColor='gray.300'
                                size="xl"
                            />
                        </>
                    ) : (
                        <>
                            {
                                instanceOfIArraySingleOrderItem(order) ? (
                                    <>
                                        <VStack>
                                            {
                                                order?.map((element: ISingleMyOrder) => (
                                                    <MyOrderCard order={element} key={element._id} />
                                                ))
                                            }
                                        </VStack>
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            as="b"
                                            fontSize="4vh"
                                            color="gray.400"
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

export default MyOrders