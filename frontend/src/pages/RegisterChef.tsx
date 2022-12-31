import { Flex } from '@chakra-ui/react'
import React from 'react'
import UserCreds from '../components/UserCreds'

const RegisterChef = () => {
    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                <UserCreds register={true} chef={true} customer={false} />
            </Flex>
        </>
    )
}

export default RegisterChef