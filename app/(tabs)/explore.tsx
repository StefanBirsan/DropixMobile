import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MapView, {Callout, Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';

type LocationType = {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
};
const INITIAL_REGION = {
    latitude: 45.7494,
    longitude: 21.2272,
    latitudeDelta: 0.07,
    longitudeDelta: 0.07,
};

const App = () => {

    const mapRef = useRef<any>(null);
    const [location, setLocation] = useState<LocationType | null>(null);  // Specify the type here
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

    const onMarkerSelected = (marker: any) => {
        console.log(marker.name);
    };

    const onRegionChange = (region: Region) => {
        console.log(region);
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
                </MapView>
                <View style={styles.focusButtonContainer}>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 20,
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
        height: '90%',
        backgroundColor: '#d2d5d9',
        padding: 15,
        borderRadius: 15,
    },
    label: {
        fontSize: 15,
        color: '#dadada',
    },
    picker: {
        height: 50,
        width: 250,
        backgroundColor: '#616b79',
        color: '#fff',
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
        color: '#fff',
    },
    focusButtonContainer: {
        position: 'absolute',
        bottom: 15,
        left: '55%',
        transform: [{ translateX: -50 }],
        padding: 10,
        borderRadius: 10,
    },
    focusButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#b1abe5',
        borderRadius: 12,
    },
    focusButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default App;