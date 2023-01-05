import { Flex, IconButton } from '@chakra-ui/react'
import React, { FC } from 'react';
import { FaAcquisitionsIncorporated } from 'react-icons/fa';
import { FaAirbnb } from 'react-icons/fa';

interface IUrl {
    url: string
}

const FooterTest: FC<IUrl> = ({ url }) => {

    return (
        <>
            <Flex
                bg="green.800"
            >
                <IconButton aria-label="login"
                    icon={url.startsWith("/login") ? <FaAcquisitionsIncorporated /> : <FaAirbnb />}
                />
            </Flex>
        </>
    )
}

export default FooterTest