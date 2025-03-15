import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import MapView, {Region} from 'react-native-maps';
import * as Location from 'expo-location';
import AWBModal from "@/scripts/AWBModal";
import { useRoute } from "@react-navigation/native";

type RootStackParamList = {
    final: { scannedData: string; };
};

type LocationType = {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
};

const App = () => {

    const route = useRoute();
    const { scannedData } = route.params as { scannedData: string };

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
    }, []);

    const INITIAL_REGION = {
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude?? 0,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
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
                    onRegionChangeComplete={onRegionChange}>
                </MapView>
                <View style={styles.focusButtonContainer}>
                    <TouchableOpacity style={styles.focusButton} onPress={focusMap}>
                        <Text style={styles.focusButtonText}>Focus</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.showInfo} onPress={() => setModalVisible(true)}>
                        <Text style={styles.infoText}>Show Package Info</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <View style={styles.modalBox}>
                        <AWBModal
                            awbInfo={scannedData}
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
    buttonsContainer: {
        flexDirection: 'row',
        width: '85%',
        marginTop: 10,
    },
    closeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#8D77AB',
        borderRadius: 12,
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
    buttonText: {
        fontSize: 20,
        color: '#FFF',
    },
    focusButtonContainer: {
        position: 'absolute',
        bottom: 15,
        left: '43%',
        transform: [{ translateX: -50 }],
        padding: 10,
        borderRadius: 10,
    },
    focusButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#8D77AB',
        borderRadius: 12,
    },
    focusButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
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
        borderWidth: 3,
        borderColor: '#8D77AB',
    },
    showInfo:{
        backgroundColor: '#8D77AB',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    infoText:{
        color:"#FFF",
        fontWeight:"bold",
    },
});

export default App;