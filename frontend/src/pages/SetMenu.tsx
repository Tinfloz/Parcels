import { Box, Flex, Input, VStack, Text, Button, useToast } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { IMenuParam } from '../interfaces/menu.interface';
import { useAppSelector, useAppDispatch } from '../typed.hooks/hooks';
import { createMenu, resetMenuHelpers } from '../reducers/chefs/chefs.slice';

const SetMenu = () => {

    const { isSuccess, isError } = useAppSelector(state => state.menus);
    const dispatch = useAppDispatch();
    const [menu, setMenu] = useState<IMenuParam>({
        item: "",
        price: "",
        left: "",
        image: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMenu(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const toast = useToast();

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        } else if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Menu set successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Menu could not be set!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        };
        dispatch(resetMenuHelpers());
        setMenu(prevState => ({
            ...prevState,
            item: "",
            price: "",
            left: "",
            image: ""
        }))
    }, [isSuccess, isError, toast, dispatch])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                <Box
                    w="50vh"
                    h="50vh"
                    borderRadius="1vh"
                    borderColor="gray.300"
                    borderWidth="1px"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                        p="3vh"
                    >
                        <VStack spacing="2vh">
                            <Text>
                                Set Menu
                            </Text>
                            <Input placeholder="item" name="item" value={menu.item} onChange={handleChange} />
                            <Input placeholder="price" name="price" value={menu.price} onChange={handleChange} />
                            <Input placeholder="left" name="left" value={menu.left} onChange={handleChange} />
                            <Input placeholder="image" name="image" value={menu.image} onChange={handleChange} />
                            <Button
                                onClick={async () => {
                                    await dispatch(createMenu(menu));
                                }}
                            >
                                Create
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default SetMenu