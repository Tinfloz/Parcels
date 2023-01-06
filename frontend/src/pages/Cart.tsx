import { Button, Flex, Spinner } from '@chakra-ui/react';
import React, { useEffect, FC } from 'react';
import MenuCard from '../components/MenuCard';
import { getMycartItems, resetCart } from '../reducers/cart/cart.slice';
import { useAppSelector, useAppDispatch } from '../typed.hooks/hooks';
import { useNavigate } from 'react-router-dom';

const Cart: FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { cart } = useAppSelector(state => state.cart);

    useEffect(() => {
        (async () => {
            await dispatch(getMycartItems())
        })()
    }, [dispatch])

    useEffect(() => {
        return () => {
            dispatch(resetCart());
        }
    }, [dispatch])

    return (
        <>
            <Flex
                borderBottom="1px"
                borderBottomColor="gray.200"
                p="1vh"
                justify="flex-end"
            >
                <Button
                    onClick={() => navigate("/checkout")}
                >
                    Place order
                </Button>
            </Flex>

            <Flex
                justify="center"
                alignItems="center"
                p="15vh"
            >
                {
                    !cart ? (
                        <>
                            <Spinner
                                speed='0.65s'
                                size="lg"
                                color='blue.500'
                                thickness='4px'
                                emptyColor='gray.200'
                            />
                        </>
                    ) : (
                        <>
                            {
                                cart?.map(element => (
                                    <MenuCard cart={true} cartItems={element} />
                                ))
                            }
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default Cart