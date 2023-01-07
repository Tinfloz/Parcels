import React, { FC } from 'react';
import { Card, CardHeader, Heading, Stack, Box, Text, CardBody, StackDivider, HStack, Avatar, Badge } from "@chakra-ui/react";
import { ISingleMyOrder } from '../interfaces/order.interface';

interface IMyOrderProp {
    order: ISingleMyOrder
}

const MyOrderCard: FC<IMyOrderProp> = ({ order }) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <Heading size='md'>{order?._id}</Heading>
                </CardHeader>

                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        {
                            order?.items?.map(element => (
                                <Box>
                                    <Heading size='xs' textTransform='uppercase'>
                                        {element?.product?.chef?.userId?.name}
                                    </Heading>
                                    <HStack>
                                        <Avatar
                                            src={element?.product?.image}
                                        />
                                        <Text pt='2' fontSize='sm'>
                                            {element?.product?.item}
                                        </Text>
                                        <Text pt='2' fontSize='lg'>
                                            {element?.qty}
                                        </Text>
                                    </HStack>
                                    <Badge colorScheme="purple">{element?.prepared}</Badge>
                                </Box>
                            ))
                        }
                    </Stack>
                </CardBody>
            </Card>
        </>
    )
}

export default React.memo(MyOrderCard)