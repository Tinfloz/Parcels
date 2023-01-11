import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Flex, Box, Text, VStack, Input, Button, useToast } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { getUserResetLink, resetUserHelpers } from '../reducers/user/user.slice';

const GetResetLink: FC = () => {

    const [email, setEmail] = useState<{ email: string }>({
        email: ""
    })

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
                description: "Email sent!",
                status: "success",
                duration: 5000,
                isClosable: true,
            })
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Email could not be sent!",
                status: "warning",
                duration: 5000,
                isClosable: true,
            })
        };
        dispatch(resetUserHelpers());
    }, [toast, dispatch, isSuccess, isError])

    return (
        <>
            <Flex
                justify="center"
                alignContent="center"
                p="15vh"
            >
                <Box
                    w="50vh"
                    h="50vh"
                    borderWidth="1px"
                    borderColor="gray.300"
                >
                    <Flex
                        justify="center"
                        alignItems="center"
                        p="3vh"
                    >
                        <VStack spacing="3vh">
                            <Text
                                as='b'
                                fontSize="3vh"
                                p="2vh"
                            >
                                Reset Password
                            </Text>
                            <Input type="email" placeholder=" enter email..." value={email.email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(prevState => ({
                                    ...prevState,
                                    email: e.target.value
                                }))} />
                            <Button
                                onClick={async () => {
                                    await dispatch(getUserResetLink(email))
                                }}
                            >
                                Generate Link
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex >
        </>
    )
}

export default GetResetLink