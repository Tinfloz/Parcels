import React, { FC, MutableRefObject, useEffect, useRef, useState } from 'react';
import {
    Box, Button, Flex, HStack, IconButton, Image, Input, Text,
    Drawer, DrawerHeader, DrawerCloseButton, DrawerContent, DrawerOverlay, DrawerFooter,
    useDisclosure,
    DrawerBody,
    VStack,
    Avatar,
    ButtonGroup,
    useToast
} from '@chakra-ui/react';
import logo from "../assets/parcels.jpeg"
import { ICart, ISendUser } from '../interfaces/auth.interface';
import { useNavigate } from "react-router-dom";
import { AiOutlineSearch, AiOutlineShoppingCart, AiOutlineDelete } from "react-icons/ai"
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { clearMyCart, removeItemUserCart, resetUserHelpers } from '../reducers/user/user.slice';
import { useAppDispatch, useAppSelector } from "../typed.hooks/hooks";

interface INavBarProps {
    user: ISendUser | null,
}

const NavBar: FC<INavBarProps> = ({ user }) => {

    const navigate = useNavigate();
    const toast = useToast();
    const dispatch = useAppDispatch();
    const type = localStorage.getItem("type");
    const url = window.location.pathname;
    const btnRef = useRef() as MutableRefObject<HTMLButtonElement>;
    const { onOpen, isOpen, onClose } = useDisclosure();
    const { isSuccess, isError } = useAppSelector(state => state.user);
    const [clearCart, setClearCart] = useState<boolean>(false)
    const [removeItem, setRemoveItem] = useState<boolean>(false)


    useEffect(() => {
        if (!isSuccess && !isError) {
            return
        } else if (isSuccess && clearCart || isSuccess && removeItem) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: clearCart ? "Cart cleared!" : "Item removed!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } else if (isError && clearCart) {
            toast({
                position: "bottom-left",
                title: "Success",
                description: clearCart ? "Cart could not be cleared!" : "Item could not be removed!",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        };
        dispatch(resetUserHelpers());
        clearCart ? setClearCart(false) : setRemoveItem(false);
    }, [isSuccess, isError, dispatch, toast])

    return (
        <>
            <Flex
                bg="orange.400"
            >
                <HStack spacing={!user ? (url === "/" ? "160vh" : "140vh") : (user?.userType === "Customer" ? "20vh" : "130vh")}>
                    <Image
                        src={logo}
                        alt="Parcels logo"
                        borderRadius="1.2vh"
                        width="4rem"
                        height="4rem"
                        ml="0.4rem"
                        mb="0.4rem"
                        mt="0.4rem"
                    />
                    {
                        !user ? (
                            <>
                                {url === "/" ? (
                                    <ColorModeSwitcher />
                                ) : (
                                    <>
                                        <HStack spacing="1vh">
                                            <Box>
                                                <Button
                                                    onClick={() => {
                                                        if (type === "Chef") {
                                                            navigate("/register/chef")
                                                        } else if (type === "Customer") {
                                                            navigate("/register/customer")
                                                        } else {
                                                            navigate("/register/delivery/partner")
                                                        }
                                                    }}
                                                >
                                                    Register
                                                </Button>
                                            </Box>
                                            <Box>
                                                <Button
                                                    onClick={() => {
                                                        if (type === "Chef") {
                                                            navigate("/login/chef")
                                                        } else if (type === "Customer") {
                                                            navigate("/login/customer")
                                                        } else {
                                                            navigate("/login/delivery/partner")
                                                        }
                                                    }}
                                                >
                                                    Login
                                                </Button>
                                            </Box>
                                            <ColorModeSwitcher />
                                        </HStack>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                {
                                    user.userType === "Customer" ? (
                                        <>
                                            <HStack spacing="63vh">
                                                <HStack>
                                                    <Input placeholder='Search...' bg="gray.200" />
                                                    <IconButton
                                                        aria-label='Search button'
                                                        icon={<AiOutlineSearch />}
                                                        bg="orange.200"
                                                        _hover={{ color: "orange.200" }}
                                                    />
                                                </HStack>
                                                <HStack spacing="3vh">
                                                    <Text fontSize="2vh">
                                                        {`Welcome back, ${user.name}!`}
                                                    </Text>
                                                    <Button>
                                                        Logout
                                                    </Button>
                                                    <IconButton
                                                        aria-label='Cart'
                                                        icon={<AiOutlineShoppingCart />}
                                                        onClick={onOpen}
                                                        ref={btnRef}
                                                    />
                                                    <Text>
                                                        {user?.loginUser?.cart?.length}
                                                    </Text>
                                                    <Drawer
                                                        isOpen={isOpen}
                                                        placement='right'
                                                        onClose={onClose}
                                                        finalFocusRef={btnRef}
                                                    >
                                                        <DrawerOverlay />
                                                        <DrawerContent>
                                                            <DrawerCloseButton />
                                                            <DrawerHeader>Your cart</DrawerHeader>
                                                            <DrawerBody>
                                                                <VStack>
                                                                    {
                                                                        user?.loginUser?.cart?.length === 0 ? (
                                                                            <>
                                                                                <Text>
                                                                                    There are no items in your cart!
                                                                                </Text>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {
                                                                                    user?.loginUser?.cart?.map((element: ICart) => (
                                                                                        <HStack spacing="1vh">
                                                                                            <Avatar
                                                                                                src={element?.item?.image}
                                                                                                name={element?.item?.item}
                                                                                                size="md"
                                                                                            />
                                                                                            <Text>
                                                                                                {element?.item?.item}
                                                                                            </Text>
                                                                                            <Text>
                                                                                                {element?.qty}
                                                                                            </Text>
                                                                                            <IconButton
                                                                                                aria-label='delete'
                                                                                                icon={<AiOutlineDelete />}
                                                                                                bg="white"
                                                                                                onClick={async () => {
                                                                                                    setRemoveItem(true)
                                                                                                    await dispatch(removeItemUserCart(element._id));
                                                                                                }}
                                                                                            />
                                                                                        </HStack>
                                                                                    ))
                                                                                }
                                                                            </>
                                                                        )
                                                                    }
                                                                </VStack>
                                                            </DrawerBody>
                                                            <DrawerFooter>
                                                                <VStack direction="column">
                                                                    <Box
                                                                        display="flex"
                                                                        justifyContent="flex-end"
                                                                        w="30vh"
                                                                    >
                                                                        <Text><strong>Total: </strong>
                                                                            ${
                                                                                ((param: any): number => {
                                                                                    let total = 0;
                                                                                    for (let element of param) {
                                                                                        total += (element?.item?.price * element?.qty)
                                                                                    };
                                                                                    return total;
                                                                                })(user?.loginUser?.cart)
                                                                            }
                                                                        </Text>
                                                                    </Box>
                                                                    <Box>
                                                                        <ButtonGroup spacing="5vh">
                                                                            <Button
                                                                                disabled={user?.loginUser?.cart.length === 0 ? true : false}
                                                                                onClick={async () => {
                                                                                    setClearCart(true)
                                                                                    await dispatch(clearMyCart());
                                                                                }}
                                                                            >
                                                                                Clear Cart
                                                                            </Button>
                                                                            <Button
                                                                                bg="purple.200"
                                                                                disabled={user?.loginUser?.cart.length === 0 ? true : false}
                                                                                onClick={() => navigate("/my/cart")}
                                                                            >
                                                                                Go to cart
                                                                            </Button>
                                                                        </ButtonGroup>
                                                                    </Box>
                                                                </VStack>
                                                            </DrawerFooter>
                                                        </DrawerContent>
                                                    </Drawer>
                                                    <ColorModeSwitcher />
                                                </HStack>
                                            </HStack>
                                        </>
                                    ) : (
                                        <>
                                            <HStack>
                                                <Button>
                                                    Logout
                                                </Button>
                                                <ColorModeSwitcher />
                                            </HStack>
                                        </>
                                    )
                                }
                            </>
                        )
                    }
                </HStack>
            </Flex>
        </>
    )
}

export default React.memo(NavBar)