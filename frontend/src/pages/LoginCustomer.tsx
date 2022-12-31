import React from 'react';
import { Flex } from '@chakra-ui/react';
import UserCreds from '../components/UserCreds';

const LoginCustomer = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <UserCreds register={false} chef={false} customer={true} />
            </Flex>
        </>
    )
}

export default LoginCustomer