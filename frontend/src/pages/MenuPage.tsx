import React, { useEffect } from 'react'
import { Flex, Spinner, Text } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks'
import { getChefMenuById, resetMenuHelpers } from '../reducers/chefs/chefs.slice'
import { IMenu } from '../interfaces/menu.interface'
import MenuCard from '../components/MenuCard'

const MenuPage = () => {

    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { chefOrMenu } = useAppSelector(state => state.menus);

    useEffect(() => {
        (async () => {
            await dispatch(getChefMenuById(id!));
            dispatch(resetMenuHelpers());
        })()
    }, [dispatch, id])

    const instanceOfIMenu = (param: any): param is IMenu => {
        return param.menu !== undefined
    }

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p="20vh"
            >
                {
                    !chefOrMenu ? (
                        <>
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                            />
                        </>
                    ) : (
                        <>
                            {
                                instanceOfIMenu(chefOrMenu) ? (
                                    <>
                                        <MenuCard menu={chefOrMenu} />
                                    </>
                                ) : (
                                    <>
                                        <Text
                                            as="b"
                                            fontSize="4vh"
                                            color="gray.300"
                                        >
                                            There was an error in displaying the page!
                                        </Text>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default MenuPage