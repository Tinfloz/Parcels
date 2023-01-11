import { Flex, HStack, Spinner, Text, VStack } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../typed.hooks/hooks';
import HomePageCard from '../components/HomePageCard';
import { getLoginUserChefs, resetMenu, resetMenuHelpers } from '../reducers/chefs/chefs.slice';
import { IChef, IMenu } from '../interfaces/menu.interface';

const Home: FC = () => {

    const { user } = useAppSelector(state => state.user);
    const { chefOrMenu } = useAppSelector(state => state.menus);
    const dispatch = useAppDispatch();
    const [location, setLocation] = useState<{ latitude: number | null, longitude: number | null }>({
        latitude: null,
        longitude: null
    });

    const instanceOfIChefArray = (param: any): param is Array<IChef> => {
        return param.length !== undefined
    };

    useEffect(() => {
        return () => {
            dispatch(resetMenu())
        };
    }, [dispatch])

    useEffect(() => {
        if (user?.userType === "Chef" || user?.userType === "Rider") {
            return
        }
        (async () => {
            let geolocationData: any = await (() => {
                return new Promise(function (resolve, reject) {
                    navigator.geolocation.getCurrentPosition(resolve, reject)
                });
            })()
            setLocation(prevState => ({
                ...prevState,
                latitude: geolocationData.coords.latitude,
                longitude: geolocationData.coords.longitude
            }))
        })()
    }, [JSON.stringify(location)])

    useEffect(() => {
        if (user?.userType === "Chef" || user?.userType === "Rider") {
            return
        }
        if (!location.latitude || !location.longitude) {
            return
        };
        (async () => {
            await dispatch(getLoginUserChefs(location));
            dispatch(resetMenuHelpers());
        })()
    }, [JSON.stringify(location)])

    return (
        <Flex
            justify="center"
            alignItems="center"
            p="10vh"
        >
            {
                user?.userType === "Customer" ? (
                    <>
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
                                instanceOfIChefArray(chefOrMenu) && chefOrMenu?.length === 0 ? (
                                    <>
                                        <Text
                                            as="b"
                                            fontSize="4vh"
                                            color="gray.300"
                                        >
                                            There are no home chefs near you!
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        {
                                            <VStack>
                                                {
                                                    instanceOfIChefArray(chefOrMenu) && chefOrMenu?.map(element => (
                                                        <HomePageCard customer={true} chef={element} />
                                                    ))
                                                }
                                            </VStack>
                                        }
                                    </>
                                )
                            )
                        }
                    </>
                ) : (
                    <>
                        {
                            user?.userType === "Chef" ? (
                                <>
                                    <VStack>
                                        <HomePageCard customer={false} text={"Upload a menu"} nav={"/set/menu"} />
                                        <HomePageCard customer={false} text={"Update or delete menu"} nav={"#"} />
                                        <HomePageCard customer={false} text={"Update account details"} nav={"#"} />
                                    </VStack>
                                </>
                            ) : (
                                <>
                                    <VStack>
                                        <HomePageCard customer={false} text={"Find deliveries nearby"} nav={"/deliveries"} />
                                        <HomePageCard customer={false} text={"Check active delivery"} nav={"/active/delivery"} />
                                        <HomePageCard customer={false} text={"Update account details"} nav={"#"} />
                                    </VStack>
                                </>
                            )
                        }
                    </>
                )
            }
        </Flex>
    )
}

export default Home