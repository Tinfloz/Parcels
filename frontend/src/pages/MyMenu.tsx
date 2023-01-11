import {
    Flex, Spinner, Table,
    Thead,
    Tbody,
    Text,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Avatar,
    Input,
    Button,
    Box,
    HStack,
    VStack,
} from '@chakra-ui/react';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { IMyMenu } from '../interfaces/chef.interface';
import { deleteLoginChefMenu, getLoginChefMenu, resetMenu, resetMenuHelpers, updateLoginChefOrder } from '../reducers/chefs/chefs.slice';
import { useAppSelector, useAppDispatch } from '../typed.hooks/hooks';
import { useNavigate } from 'react-router-dom';

const MyMenu: FC = () => {

    const dispatch = useAppDispatch();
    const { chefOrMenu, isSuccess, isError } = useAppSelector(state => state.menus);
    const navigate = useNavigate();

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
    });

    const [deleted, setDeleted] = useState<boolean>(false)


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
                    !deleted ? (
                        <>
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
                                            <HStack ml="45vh" mt="8vh">
                                                <Button
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
                                                <Button
                                                    onClick={async () => {
                                                        setDeleted(true)
                                                        await dispatch(deleteLoginChefMenu());
                                                        dispatch(resetMenuHelpers());
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </HStack>
                                        </Box>
                                    </>
                                )
                            }
                        </>
                    ) : (
                        <>
                            <VStack>
                                <Text
                                    as="b"
                                    fontSize="4vh"
                                    color="gray.300"
                                >
                                    Menu has been deleted
                                </Text>
                                <Button
                                    onClick={() => navigate("/set/menu")}
                                >
                                    Create Menu
                                </Button>
                            </VStack>
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default MyMenu