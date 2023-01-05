import React, { FC, useState, ChangeEvent } from 'react';
import {
    Card, CardBody, CardFooter, Heading,
    Text, Stack, Image, Divider, ButtonGroup, Button, HStack, Flex, Select, Box
} from "@chakra-ui/react";
import { IMenu } from '../interfaces/menu.interface';
import { useAppDispatch, useAppSelector } from "../typed.hooks/hooks";
import { addCartUser, resetUserHelpers } from '../reducers/user/user.slice';

interface IMenuCardProp {
    menu: IMenu
}

const MenuCard: FC<IMenuCardProp> = ({ menu }) => {

    let rows = [], i = 0, len = 10;
    while (++i <= len) rows.push(i);

    const [quantity, setQuantity] = useState<{ qty: string }>({
        qty: ""
    })

    const dispatch = useAppDispatch();

    return (
        <>
            <Card maxW='sm'>
                <CardBody>
                    <Image
                        src={menu?.menu?.image}
                        alt={menu?.menu?._id}
                        borderRadius='lg'
                    />
                    <Stack mt='6' spacing='3'>
                        <Heading size='md'>{menu?.userId?.name}</Heading>
                        <Text>
                            {menu?.menu?.item}
                        </Text>
                        <Flex
                            justifyContent="center"
                        >
                            <HStack spacing="3vh">
                                <Text color='blue.600' fontSize='2xl'>
                                    ${menu?.menu?.price}
                                </Text>
                                <Text color='blue.600' fontSize='2xl'>
                                    Stock: {menu?.menu?.left}
                                </Text>
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
                    <ButtonGroup spacing='2'>
                        <Button variant='solid' colorScheme='blue'>
                            Buy now
                        </Button>
                        <Button variant='ghost' colorScheme='blue'
                            onClick={async () => {
                                let cartDetails = {
                                    id: menu?.menu?._id,
                                    quantity
                                }
                                await dispatch(addCartUser(cartDetails));
                                dispatch(resetUserHelpers());
                            }}
                        >
                            Add to cart
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    )
}

export default React.memo(MenuCard)