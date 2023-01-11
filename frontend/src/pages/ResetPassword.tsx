import React, { ChangeEvent, FC, useState, useEffect } from 'react';
import { Flex, Box, Text, Input, Button, VStack, useToast } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { resetPasswordUser, resetUserHelpers } from '../reducers/user/user.slice';

const ResetPassword: FC = () => {
    const dispatch = useAppDispatch();
    const toast = useToast();
    const { isSuccess, isError } = useAppSelector(state => state.user);
    const navigate = useNavigate();

    const [passwordDetails, setPasswordDetails] = useState<{ password: string, confirmPassword: string }>({
        password: "",
        confirmPassword: ""
    });

    const { resetToken } = useParams();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordDetails(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        } else if (isSuccess) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: "Password reset successfully!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setTimeout(() => navigate("/"), 4000);
        } else if (isError) {
            toast({
                position: "bottom-left",
                title: "Error",
                description: "Password could not be reset!",
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
                alignItems="center"
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
                            <Input type="password" placeholder="password" name="password"
                                value={passwordDetails.password} onChange={handleChange}
                            />
                            <Input type="password" placeholder="confirm password" name="confirmPassword"
                                value={passwordDetails.confirmPassword} onChange={handleChange}
                            />
                            <Button
                                onClick={async () => {
                                    let passwordChangeDetails = {
                                        resetToken: resetToken!,
                                        passwordDetails
                                    };
                                    await dispatch(resetPasswordUser(passwordChangeDetails));
                                    setPasswordDetails(prevState => ({
                                        ...prevState,
                                        password: "",
                                        confirmPassword: ""
                                    }))
                                }}
                            >
                                Reset Password
                            </Button>
                        </VStack>
                    </Flex>
                </Box>
            </Flex>
        </>
    )
}

export default ResetPassword