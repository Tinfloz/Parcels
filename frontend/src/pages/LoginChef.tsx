import React from 'react'
import { Flex } from '@chakra-ui/react'
import UserCreds from '../components/UserCreds'

const LoginChef = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <UserCreds register={false} chef={true} customer={false} />
            </Flex>
        </>
    )
}

export default LoginChef