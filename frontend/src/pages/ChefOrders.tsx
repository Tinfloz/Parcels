import {
    Flex, Spinner, Text, Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    Badge,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { IMyChefOrder } from '../interfaces/chef.interface';
import { acceptLoginChefOrders, getLoginChefAcceptedOrders, getLoginChefRequestedOrders, markLoginChefOrdersPrepared, rejectLoginChefOrders, resetChefHelpers } from '../reducers/chef.orders/chef.order.slice';
import { useAppDispatch, useAppSelector } from "../typed.hooks/hooks";

interface IChefOrderProps {
    accepted: boolean
}

const ChefOrders: FC<IChefOrderProps> = ({ accepted }) => {

    const dispatch = useAppDispatch();
    const { myOrders } = useAppSelector(state => state.chef);

    useEffect(() => {
        (async () => {
            accepted ? await dispatch(getLoginChefAcceptedOrders()) : await dispatch(getLoginChefRequestedOrders());
            dispatch(resetChefHelpers());
        })()
    }, [dispatch])

    const instanceOfIRequestedOrders = (param: any): param is Array<IMyChefOrder> => {
        return param.length !== 0 && param[0].elementId !== undefined
    }

    const [state, setState] = useState<Array<any>>([])
    const [idArray, setIdArray] = useState<Array<string | null>>([])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                {
                    !myOrders ? (
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
                                instanceOfIRequestedOrders(myOrders) ? (
                                    <>
                                        <TableContainer>
                                            <Table variant="simple">
                                                <TableCaption>{accepted ? "Accepted Orders" : "Requested Orders"}</TableCaption>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Quantity</Th>
                                                        <Th>Customer</Th>
                                                        <Th>Order ID</Th>
                                                        <Th>Status</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        myOrders?.map(element => (
                                                            <>
                                                                <Tr>
                                                                    <Td>{element?.qty}</Td>
                                                                    <Td>{element?.orderId?.customer?.userId?.name}</Td>
                                                                    <Td>{element?.orderId?._id}</Td>
                                                                    {
                                                                        !accepted ? (
                                                                            <>
                                                                                {
                                                                                    ((): boolean => {
                                                                                        let res: Array<string | null> = [];
                                                                                        for (let i of state) {
                                                                                            res.push(i.id);
                                                                                        };
                                                                                        let val = res.some(el => el === element?._id);
                                                                                        return val;
                                                                                    })() ? (
                                                                                        <>
                                                                                            <Td>
                                                                                                <Badge colorScheme="purple">
                                                                                                    {
                                                                                                        ((): string => {
                                                                                                            let res = ""
                                                                                                            for (let i of state) {
                                                                                                                if (i.id === element?._id) {
                                                                                                                    res = i.status
                                                                                                                };
                                                                                                            };
                                                                                                            return res;
                                                                                                        })()
                                                                                                    }
                                                                                                </Badge>
                                                                                            </Td>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <Td>
                                                                                                <Button
                                                                                                    bg="green.300"
                                                                                                    onClick={async () => {
                                                                                                        setState([
                                                                                                            ...state,
                                                                                                            {
                                                                                                                id: element?._id,
                                                                                                                status: "Accepted"
                                                                                                            }
                                                                                                        ]);
                                                                                                        await dispatch(acceptLoginChefOrders(element?._id));
                                                                                                        dispatch(resetChefHelpers());
                                                                                                    }}
                                                                                                >
                                                                                                    Accept
                                                                                                </Button>
                                                                                            </Td>
                                                                                            <Td>
                                                                                                <Button
                                                                                                    bg="red.300"
                                                                                                    onClick={async () => {
                                                                                                        setState([
                                                                                                            ...state,
                                                                                                            {
                                                                                                                id: element?._id,
                                                                                                                status: "Rejected"
                                                                                                            }
                                                                                                        ]);
                                                                                                        await dispatch(rejectLoginChefOrders(element?._id));
                                                                                                        dispatch(resetChefHelpers());
                                                                                                    }}
                                                                                                >
                                                                                                    Reject
                                                                                                </Button>
                                                                                            </Td>
                                                                                        </>
                                                                                    )
                                                                                }
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {
                                                                                    ((): boolean => {
                                                                                        const val = idArray.some(el => el === element?._id);
                                                                                        return val
                                                                                    })() ? (
                                                                                        <>
                                                                                            <Td>
                                                                                                <Badge colorScheme="purple">
                                                                                                    Prepared
                                                                                                </Badge>
                                                                                            </Td>
                                                                                        </>
                                                                                    ) : (
                                                                                        <>
                                                                                            <Td>
                                                                                                <Button
                                                                                                    bg="orange"
                                                                                                    onClick={async () => {
                                                                                                        setIdArray([
                                                                                                            ...idArray,
                                                                                                            element?._id
                                                                                                        ]);
                                                                                                        let orderDetails = {
                                                                                                            orderId: element?.orderId?._id,
                                                                                                            elementId: element?.elementId
                                                                                                        };
                                                                                                        await dispatch(markLoginChefOrdersPrepared(orderDetails));
                                                                                                        dispatch(resetChefHelpers());
                                                                                                    }}
                                                                                                >
                                                                                                    Prepared
                                                                                                </Button>
                                                                                            </Td>
                                                                                        </>
                                                                                    )
                                                                                }
                                                                            </>
                                                                        )
                                                                    }
                                                                </Tr>
                                                            </>
                                                        ))
                                                    }
                                                </Tbody>
                                            </Table>
                                        </TableContainer>
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            as="b"
                                            color="gray.300"
                                            fontSize="4vh"
                                        >
                                            There has been an error in loading this page!
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

export default ChefOrders