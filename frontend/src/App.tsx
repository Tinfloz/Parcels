import React, { FC } from "react"
import {
  ChakraProvider,
  Box,
  Text,
  theme,
} from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterChef from "./pages/RegisterChef";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterRider from "./pages/RegisterRider";
import LoginChef from "./pages/LoginChef";
import LoginCustomer from "./pages/LoginCustomer";
import LoginRider from "./pages/LoginRider";
import Landing from "./pages/Landing";
import NavBar from "./components/NavBar";
import SetAddress from "./pages/SetAddress";
import { useAppSelector } from "./typed.hooks/hooks";
import Home from "./pages/Home";
import SetMenu from "./pages/SetMenu";
import MenuPage from "./pages/MenuPage";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import MyMenu from "./pages/MyMenu";
import ChefOrders from "./pages/ChefOrders";
import NearbyDeliveries from "./pages/NearbyDeliveries";
import ClaimedDelivery from "./pages/ClaimedDelivery";
import DeliverySuccess from "./pages/DeliverySuccess";

export const App: FC = () => {

  console.log("app rerendered")

  const { user } = useAppSelector(state => state.user);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Router>
          <NavBar user={user} />
          <Routes>
            <Route path="/register/chef" element={<RegisterChef />} />
            <Route path="/register/customer" element={<RegisterCustomer />} />
            <Route path="/register/delivery/partner" element={<RegisterRider />} />
            <Route path="/login/customer" element={<LoginCustomer />} />
            <Route path="/login/delivery/partner" element={<LoginRider />} />
            <Route path="/login/chef" element={<LoginChef />} />
            <Route path="/set/address" element={<SetAddress />} />
            <Route path="/home" element={<Home />} />
            <Route path="/set/menu" element={<SetMenu />} />
            <Route path="/get/menu/:id" element={<MenuPage />} />
            <Route path="/checkout/:id/:qty" element={<Checkout cart={false} />} />
            <Route path="/checkout" element={<Checkout cart={true} />} />
            <Route path="/my/cart" element={<Cart />} />
            <Route path="/my/orders" element={<MyOrders />} />
            <Route path="/my/menu" element={<MyMenu />} />
            <Route path="/get/requested/orders" element={<ChefOrders accepted={false} />} />
            <Route path="/get/accepted/orders" element={<ChefOrders accepted={true} />} />
            <Route path="/deliveries" element={<NearbyDeliveries />} />
            <Route path="/active/delivery" element={<ClaimedDelivery />} />
            <Route path="/success" element={<DeliverySuccess />} />
            <Route path="/" element={<Landing />} />
          </Routes>
        </Router>
      </Box>
    </ChakraProvider>
  )
}
