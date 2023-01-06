import React, { FC, useState, ChangeEvent } from 'react';
import {
    Card, CardBody, CardFooter, Heading,
    Text, Stack, Image, Divider, ButtonGroup, Button, HStack, Flex, Select, Box
} from "@chakra-ui/react";
import { IMenu } from '../interfaces/menu.interface';
import { useAppDispatch, useAppSelector } from "../typed.hooks/hooks";
import { addCartUser, resetUserHelpers } from '../reducers/user/user.slice';
import { useNavigate } from "react-router-dom"
import { ICartItems } from '../interfaces/cart.interface';
import { changeUserCartQty, resetCartHelpers } from '../reducers/cart/cart.slice';

interface IMenuCardProp {
    menu?: IMenu,
    cart?: boolean,
    cartItems?: ICartItems
}

const MenuCard: FC<IMenuCardProp> = ({ menu, cart, cartItems }) => {

    let rows = [], i = 0, len = 10;
    while (++i <= len) rows.push(i);

    const [quantity, setQuantity] = useState<{ qty: string }>({
        qty: ""
    })

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <>
            <Card maxW='sm'>
                <CardBody>
                    <Image
                        src={!cart ? menu?.menu?.image : cartItems?.item?.image}
                        alt={!cart ? menu?.menu?._id : cartItems?._id}
                        borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>{!cart ? menu?.userId?.name : cartItems?.item?.chef?.userId?.name}</Heading>
                        <Text>
                            {!cart ? menu?.menu?.item : cartItems?.item?.item}
                        </Text>
                        <Flex
                            justifyContent="center"
                        >
                            <HStack spacing="3vh">
                                <Text color='blue.600' fontSize='2xl'>
                                    ${!cart ? menu?.menu?.price : cartItems!.item?.price}
                                </Text>
                                {!cartItems ?
                                    (
                                        <>
                                            <Text color='blue.600' fontSize='2xl'>
                                                Stock: {menu?.menu?.left}
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Text>
                                                Quantity: {cartItems?.qty}
                                            </Text>
                                        </>
                                    )}
                                <Select w="10vh" onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    setQuantity(prevState => ({
                                        ...prevState,
                                        qty: e.target.value
                                    }))
                                }}>
                                    {
                                        rows.map(element => (
                                            <option value={element}>{element}</option>
                                        ))
                                    }
                                </Select>
                            </HStack>
                        </Flex>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                    {!cart ? (
                        <>
                            <ButtonGroup spacing='2'>
                                <Button variant='solid' colorScheme='blue'
                                    onClick={() => {
                                        navigate(`/checkout/${menu?.userId?._id}/${quantity.qty}`)
                                    }}
                                >
                                    Buy now
                                </Button>
                                <Button variant='ghost' colorScheme='blue'
                                    onClick={async () => {
                                        let cartDetails = {
                                            id: menu?.menu?._id!,
                                            quantity
                                        }
                                        await dispatch(addCartUser(cartDetails!));
                                        dispatch(resetUserHelpers());
                                    }}
                                >
                                    Add to cart
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            <Flex
                                justify="center"
                                alignItems="center"
                            >
                                <Button
                                    onClick={async () => {
                                        let changeDetails = {
                                            id: cartItems?._id!,
                                            quantity
                                        }
                                        await dispatch(changeUserCartQty(changeDetails));
                                        dispatch(resetCartHelpers());
                                    }}
                                >
                                    Edit quantity
                                </Button>
                            </Flex>
                        </>
                    )}
                </CardFooter>
            </Card>
        </>
    )
}

export default React.memo(MenuCard)