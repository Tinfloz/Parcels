// const API_KEY = "AIzaSyBPGZrBJq-5QKmFmeUeFmTMUj9431LwDX4"
import React, { useEffect, useState } from 'react';
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { Flex, Spinner } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from '../typed.hooks/hooks';
import { claimLoginRiderDelivery, getLoginRiderNearbyDeliveries, resetRider, resetRiderHelpers } from '../reducers/rider/rider.slice';
import { INearbyDelivery } from '../interfaces/rider.interface';

const NearbyDeliveries = () => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!
    });

    const [center, setCenter] = useState<any>({
        lat: 0,
        lng: 0
    });

    const { deliveries } = useAppSelector(state => state.rider);

    const instanceOfIArrayDeliveries = (param: any): param is Array<INearbyDelivery> => {
        return param.length !== undefined && param[0].pickUp !== undefined
    }

    const dispatch = useAppDispatch();

    const getLatLng = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    useEffect(() => {
        (async () => {
            let geolocation: any = await getLatLng();
            const deliveryDetails = {
                latitude: geolocation.coords.latitude,
                longitude: geolocation.coords.longitude
            }
            await dispatch(getLoginRiderNearbyDeliveries(deliveryDetails));
        })()
    }, [])

    useEffect(() => {
        return () => {
            dispatch(resetRider())
        }
    }, [dispatch])

    useEffect(() => {
        (async () => {
            let geolocationData: any = await getLatLng();
            setCenter((prevState: any) => ({
                ...prevState,
                lat: geolocationData.coords.latitude,
                lng: geolocationData.coords.longitude
            }))
        })()
    }, [])

    return (
        <>
            <Flex
                justify="center"
                alignItems="center"
                p={!isLoaded ? "15vh" : "0vh"}
            >
                {
                    !isLoaded || !deliveries ? (
                        <>
                            <Spinner
                                speed='0.65s'
                                color='blue.500'
                                emptyColor='gray.300'
                                size="xl"
                            />
                        </>
                    ) : (
                        <>
                            <GoogleMap
                                center={center}
                                zoom={15}
                                mapContainerStyle={{ width: "100%", height: "100vh" }}
                            >
                                <Marker
                                    position={center}
                                    title="Your location"
                                    label={{ text: "You", color: "white" }}
                                />
                                {
                                    ((): Array<{ deliveryId: string, coords: { lat: number, lng: number } }> => {
                                        let arr: Array<{ deliveryId: string, coords: { lat: number, lng: number } }> = [];
                                        instanceOfIArrayDeliveries(deliveries) && deliveries?.forEach(el => {
                                            let arrEl = {
                                                deliveryId: el.deliveryId,
                                                coords: {
                                                    lat: el.pickUp.latitude,
                                                    lng: el.pickUp.longitude
                                                }
                                            };
                                            arr.push(arrEl)
                                        });
                                        return arr;
                                    })().map(center => (
                                        <Marker
                                            position={center.coords}
                                            onClick={async () => {
                                                await dispatch(claimLoginRiderDelivery(center.deliveryId));
                                                dispatch(resetRiderHelpers());
                                                window.open(`https://maps.google.com?q=${center.coords.lat},${center.coords.lng}`)
                                            }}
                                        />
                                    ))
                                }
                            </GoogleMap>
                        </>
                    )
                }
            </Flex>
        </>
    )
}

export default NearbyDeliveries