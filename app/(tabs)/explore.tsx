import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, Linking, Button} from 'react-native';
import MapView, {Callout, Marker, Region} from 'react-native-maps';
import * as Location from 'expo-location';
import AWBModal from "@/scripts/AWBModal";
import {useNavigation, useRoute} from "@react-navigation/native";
import { getDatabase } from "@firebase/database";
import { widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { ref, database, get } from "@/scripts/firebase";
import { GeocodingAPI} from "@/scripts/firebase";

type RootStackParamList = {
    final: { scannedData: string; };
};

interface LocationData {
    id: string;
    Address: string;
    City: string;
}

type LocationType = {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
};

interface RegionData {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

const App = () => {

    const navigation = useNavigation();

    const route = useRoute();
    const { scannedData } = route.params as { scannedData: string };

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [status, setStatus] = useState("");
    const [productName, setProductName] = useState("");
    const [noData, setNoData] = useState("");

    const mapRef = useRef<any>(null);
    const [location, setLocation] = useState<LocationType | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    const focusMap = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            });
        }
    };
    const [isModalVisible, setModalVisible] = useState(false);


    const onClose = () => {
        setModalVisible(false);
    };

    const onRegionChange = (region: Region) => {
        console.log(region);
    };

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase();
            const dbRef = ref(db, `BOX/${scannedData}`);

            try {
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setAddress(data.Address || "Unknown");
                    setCity(data.City || "Unknown");
                    setStatus(data.Status || "Unknown");
                    setProductName(data.productName || "Unknown");
                } else {
                    setNoData("No data found for scannedData.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();

        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation.coords);

            mapRef.current.animateToRegion({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            });
        })();
    }, [scannedData]);

    const INITIAL_REGION = {
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude?? 0,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    };

    const [locations, setLocations] = useState<LocationData[]>([]);
    const [foundLocation, setFoundLocation] = useState<LocationData | null>(null);
    const [region, setRegion] = useState<RegionData | null>(null);
    const [fullAddress, setFullAddress] = useState<string | null>(null); // Stores full address for Google Maps

    useEffect(() => {
        const fetchDataAddress = async () => {
            try {
                const db = getDatabase();
                const snapshot = await get(ref(db, "BOX"));

                if (snapshot.exists()) {
                    const data = snapshot.val();

                    // Extract AWB ID, Address, and City
                    const locationList: LocationData[] = Object.keys(data).map(awbID => ({
                        id: awbID,
                        Address: data[awbID].Address,
                        City: data[awbID].City,
                    }));

                    setLocations(locationList);
                    console.log("Fetched Locations:", locationList);
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error("Error fetching data from Firebase:", error);
            }
        };

        fetchDataAddress();
    }, []);

    // Search AWB ID and get location
    const searchByAWB = async () => {
        const result = locations.find(loc => loc.id === scannedData);
        if (result) {
            console.log("Found Location:", result);
            setFoundLocation(result);
            setFullAddress(`${result.Address}, ${result.City}`);
            await getCoordinates(result.Address, result.City);
        } else {
            console.log("AWB ID not found!");
            setFoundLocation(null);
            setRegion(null);
        }
    };
    const getCoordinates = async (address: string, city: string) => {
        const query = encodeURIComponent(`${address}, ${city}`);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${'AIzaSyBnOXyN8eHSbv-grb_rkKlLxT74oBntUHM'}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Google API Response:", JSON.stringify(data, null, 2)); // 🔍 Log full response

            if (data.status === "OK" && data.results.length > 0) {
                const location = data.results[0].geometry.location;
                console.log("Found Coordinates:", location);

                setRegion({
                    latitude: location.lat,
                    longitude: location.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            } else {
                console.log("Google API Error:", data.status);
                setRegion(null);
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        }
    };

    const openGoogleMaps = () => {
        if (fullAddress) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;
            Linking.openURL(url);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={INITIAL_REGION}
                    showsUserLocation={!!location}
                    showsMyLocationButton
                    ref={mapRef}
                    onRegionChangeComplete={onRegionChange}
                >
                    {foundLocation ? (
                        <View>
                            <Text>AWB ID: {scannedData}</Text>
                            <Text>Address: {foundLocation.Address}, {foundLocation.City}</Text>
                        </View>
                    ) : (
                        <Text>No Address Found for AWB ID: {scannedData}</Text>
                    )}
                    {region && (
                            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
                                <Callout onPress={openGoogleMaps}>
                                    <View style={{ padding: 5 }}>
                                        <TouchableOpacity style={styles.button}>
                                            <Text>{foundLocation?.Address}, {foundLocation?.City}</Text>
                                            <Text style={{ color: "blue", textDecorationLine: "underline" }}>
                                                Navigate
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Callout>
                            </Marker>
                    )}
                </MapView>
                <View style={styles.focusButtonContainer}>
                    <TouchableOpacity style={styles.showInfo} onPress={() => navigation.navigate('index')}>
                        <Text style={styles.infoText}>Back to Menu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.focusButton} onPress={searchByAWB}>
                        <Text style={styles.focusButtonText}>Take Me There</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.showInfo} onPress={() => setModalVisible(true)}>
                        <Text style={styles.infoText}>Package Info</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <AWBModal
                            awbInfo={scannedData}
                            address={address}
                            city={city}
                            status={status}
                            productName={productName}
                        />
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    mapContainer: {
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#616b79',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    focusButtonContainer: {
        position: 'absolute',
        bottom: wp('10%'),
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-evenly',
    },
    focusButton: {
        backgroundColor: '#8D77AB',
        borderWidth: 1,
        borderColor: '#664e8b',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
    },
    focusButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 25,
        textShadowColor: 'black',
        textShadowOffset: {width:1, height: 1},
        textShadowRadius: 3,
    },
    showInfo:{
        backgroundColor: '#8D77AB',
        borderWidth: 1,
        borderColor: '#664e8b',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
    },
    infoText:{
        color:"#FFF",
        fontWeight:"bold",
        textShadowColor: 'black',
        textShadowOffset: {width:1, height: 1},
        textShadowRadius: 3,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBox: {
        width: '90%',
        maxWidth: 400,
        height: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#664e8b',
    },
    closeButton: {
        backgroundColor: '#8D77AB',
        borderWidth: 1,
        borderColor: '#664e8b',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
        width: '40%',
    },
    buttonText: {
        fontSize: 25,
        color: '#FFF',
        textShadowColor: 'black',
        textShadowOffset: {width:1, height: 1},
        textShadowRadius: 3,
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
});

export default App;