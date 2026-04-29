import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import axios from "axios";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import InputBox from "./InputBox";
import GlassContainer from "./customcomponents/GlassContainer";
import { IconComponentLocation } from "../constants/IconComponents";

const LocationPicker = ({
    latitude,
    longitude,
    setLatitude,
    setLongitude,
    address,
    setAddress,
    error,
    setError,
    label,
    apiKey
}) => {

    const googleRef = useRef(null);
    const mapRef = useRef(null);

    // 2. Function to get current location
    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setError('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude: lat, longitude: lng } = location.coords;

        setLatitude(lat);
        setLongitude(lng);

        // Animate map to current location
        mapRef.current?.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        });
    };


    useEffect(() => {
        if (latitude && longitude) {
            fetchAddress(latitude, longitude);
        } else {
            getCurrentLocation(); // Auto-fetch on mount if empty
        }
    }, [latitude, longitude]);


    const fetchAddress = async (lat, lng) => {
        try {

            const url =
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

            const response = await axios.get(url);

            if (
                response.data.status === "OK" &&
                response.data.results.length > 0
            ) {
                const formattedAddress =
                    response.data.results[0].formatted_address;

                setAddress(formattedAddress);
                setError(null);

                googleRef.current?.setAddressText(formattedAddress);
            }

        } catch (error) {
            console.log("Geocode error", error);
        }
    };

    return (
        <View>

            <InputBox
                label={"Latitude"}
                placeholder={"Latitude"}
                inputStyle={{ w: '100%', h: 50, ph: 20 }}
                InputType={'numeric'}
                onChangeText={(text) => { setLatitude(text) }}
                textVlaue={latitude?.toString() || ""} 
                isRequired={true}
                editable={false}
            />

            <InputBox
                label={"Longitude"}
                placeholder={"Longitude"}
                inputStyle={{ w: '100%', h: 50, ph: 20 }}
                InputType={'numeric'}
                onChangeText={(text) => { setLongitude(text) }}
                    textVlaue={longitude?.toString() || ""}
                isRequired={true}
                editable={false}
            />


            {/* ADDRESS LABEL */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Text style={{ color: "red" }}>* </Text>
                <Text style={{ color: "#fff" }}>{label}</Text>
            </View>

            {/* AUTOCOMPLETE */}
            <GlassContainer padding={0.1}>
                <GooglePlacesAutocomplete
                    ref={googleRef}
                    placeholder={label}
                    fetchDetails
                    onPress={(data, details = null) => {

                        const lat = details.geometry.location.lat;
                        const lng = details.geometry.location.lng;

                        setLatitude(lat);
                        setLongitude(lng);

                        setAddress(data.description);
                        setError(null);
                    }}
                    query={{
                        key: apiKey,
                        language: "en",
                    }}
                    textInputProps={{
                        value: address,
                        onChangeText: (text) => {
                            setAddress(text);
                            setError(null);
                        }
                    }}
                    styles={{
                        textInput: {
                            height: 45,
                            // borderWidth: 1,
                            borderColor: error ? "red" : "#ccc",
                            paddingHorizontal: 10,
                            borderRadius: 8,
                            backgroundColor: 'transparent',
                            color: '#fff'
                        }
                    }}
                />
            </GlassContainer>

            {error && (
                <Text style={{ color: "red", marginTop: 4 }}>
                    {error}
                </Text>
            )}
{/* 
            <TouchableOpacity
                onPress={getCurrentLocation}
                style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 5, marginTop: 10 }}
            >
                <Text style={{ color: 'white', textAlign: 'center' }}>Get Current Location</Text>
            </TouchableOpacity> */}


            {/* MAP */}
            <MapView
                style={{ height: 200, marginTop: 20 }}
                onPress={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setLatitude(latitude);
                    setLongitude(longitude);
                }}
                region={{
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: Number(latitude),
                        longitude: Number(longitude),
                    }}
                />
            </MapView>

            {/* LOCATE ME BUTTON OVERLAY */}
            <TouchableOpacity
                onPress={getCurrentLocation}
                style={{
                    position: 'absolute',
                    bottom: 15,
                    right: 15,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: 8,
                    borderRadius: 50,
                    elevation: 5, // Shadow for Android
                    shadowColor: '#000', // Shadow for iOS
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <IconComponentLocation color={'grey'} size={25} />
                <Text style={{ marginLeft: 5, color: 'grey', fontSize: 12, fontWeight: '600' }}>
                    Locate Me
                </Text>
            </TouchableOpacity>




        </View>
    );
};

export default LocationPicker;