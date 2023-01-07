import {
    Flex, Spinner, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Avatar,
    Input,
    Button,
    Box,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { IMyMenu } from '../interfaces/errors/chef.interface';
import { getLoginChefMenu, resetMenu, resetMenuHelpers, updateLoginChefOrder } from '../reducers/chefs/chefs.slice';
import { useAppSelector, useAppDispatch } from '../typed.hooks/hooks';

const MyMenu: FC = () => {

    const dispatch = useAppDispatch();
    const { chefOrMenu } = useAppSelector(state => state.menus);

    const instanceOfIMyMenu = (param: any): param is IMyMenu => {
        return param.price !== undefined
    }

    useEffect(() => {
        (async () => {
            await dispatch(getLoginChefMenu());
            dispatch(resetMenuHelpers())
        })()
    }, [dispatch, JSON.stringify(chefOrMenu)])

    useEffect(() => {
        return () => {
            dispatch(resetMenu())
        }
    }, [dispatch])

    const [updateMenu, setUpdateMenu] = useState<{
        image: string,
        price: string,
        left: string,
        item: string
    }>({
        image: "",
        price: "",
        item: "",
        left: ""
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUpdateMenu(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                {
                    !chefOrMenu ? (
                        <>
                            <Spinner
                                speed='0.65s'
                                color='blue.500'
                                emptyColor='gray.300'
                                size="lg"
                            />
                        </>
                    ) : (
                        <>
                            <Box
                                borderWidth="1px"
                                borderColor="gray.300"
                                borderRadius="1vh"
                                w="80vh"
                                h="50vh"
                            >
                                <TableContainer>
                                    <Table
                                        variant="simple"
                                        size="lg"
                                    >
                                        <TableCaption>My menu</TableCaption>
                                        <Thead>
                                            <Tr>
                                                <Th>Item</Th>
                                                <Th isNumeric>Price</Th>
                                                <Th isNumeric>Stock</Th>
                                                <Th>Image</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            <Tr>
                                                {instanceOfIMyMenu(chefOrMenu) &&
                                                    (
                                                        <>
                                                            <Td>{chefOrMenu?.item}</Td>
                                                            <Td> ₹{chefOrMenu?.price}</Td>
                                                            <Td isNumeric>{chefOrMenu?.left}</Td>
                                                            <Td>
                                                                <Avatar
                                                                    src={chefOrMenu?.image}
                                                                    name={chefOrMenu?.item}
                                                                    size="sm"
                                                                />
                                                            </Td>
                                                        </>
                                                    )}
                                            </Tr>
                                            <Tr>
                                                <Td>
                                                    <Input placeholder="item..." name="item" value={updateMenu.item}
                                                        onChange={handleChange}
                                                    />
                                                </Td>
                                                <Td>
                                                    <Input placeholder="price..." name="price" value={updateMenu.price}
                                                        onChange={handleChange}
                                                    />
                                                </Td>
                                                <Td>
                                                    <Input placeholder="stock..." name="left" value={updateMenu.left}
                                                        onChange={handleChange}
                                                    />
                                                </Td>
                                                <Td>
                                                    <Input placeholder="image..." name="image" value={updateMenu.image}
                                                        onChange={handleChange}
                                                    />
                                                </Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                                <Button
                                    mt="8vh"
                                    ml="55vh"
                                    disabled={Object.values(updateMenu).some(element => element.length !== 0) ? false : true}
                                    onClick={async () => {
                                        await dispatch(updateLoginChefOrder(updateMenu));
                                        dispatch(resetMenuHelpers());
                                        setUpdateMenu(prevState => ({
                                            ...prevState,
                                            image: "",
                                            price: "",
                                            item: "",
                                            left: ""
                                        }))
                                    }}
                                >
                                    Update menu
                                </Button>
                            </Box>
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default MyMenu