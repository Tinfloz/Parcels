import React from 'react';
import { Flex } from '@chakra-ui/react';
import UserCreds from '../components/UserCreds';

const LoginRider = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <UserCreds register={false} chef={false} customer={false} />
            </Flex>
        </>
    )
}

export default LoginRider