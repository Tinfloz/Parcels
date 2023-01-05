import React, { ChangeEvent, useState, useEffect } from 'react';
import { Box, Button, Flex, Input, Select, VStack, useToast } from "@chakra-ui/react"
import { provinceArray } from "../assets/states";
import { ISetAddressParam } from '../interfaces/auth.interface';
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { resetUserHelpers, setAddressLoginUser } from '../reducers/user/user.slice';

const SetAddress = () => {

    const [address, setAddress] = useState<ISetAddressParam>({
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAddress(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const toast = useToast();
    const dispatch = useAppDispatch();
    const { isSuccess, isError } = useAppSelector(state => state.user);

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        } else if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Address set!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Address could not be set!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
        };
        dispatch(resetUserHelpers());
    }, [isSuccess, isError, toast, dispatch])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="25vh"
            >
                <Box
                    w="50vh"
                    h="50vh"
                    borderRadius="1vh"
                    borderWidth="1px"
                    borderColor="gray.300"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                        p="3vh"
                    >
                        <VStack>
                            <Input placeholder='address' name="address"
                                value={address.address} onChange={handleChange}
                            />
                            <Input placeholder='city' name="city"
                                value={address.city} onChange={handleChange}
                            />
                            <Input placeholder='pincode' name="pincode"
                                value={address.pincode} onChange={handleChange}
                            />
                            <Select value={address.state} name="state" onChange={handleChange}>
                                {
                                    provinceArray.map((element: string) => (
                                        <option value={element}>{element}</option>
                                    ))
                                }
                            </Select>
                            <Button
                                onClick={
                                    async () => {
                                        await dispatch(setAddressLoginUser(address));
                                        setAddress(prevState => ({
                                            ...prevState,
                                            address: "",
                                            city: "",
                                            state: "",
                                            pincode: ""
                                        }));
                                    }
                                }
                            >
                                Set Address
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex >
        </>
    )
}

export default SetAddress