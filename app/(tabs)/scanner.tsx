import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import {View, Button, Text, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    if (!permission?.granted) {
        return (
            Alert.alert("Permission Granted")
        );
    }

    // @ts-ignore
    const handleBarcodeScanned = ({ data }) => {
        if (!scanned) {
            // @ts-ignore
            navigation.navigate('explore', {scannedData: data})
        }
    };

    return (
        <CameraView
            style={{ flex: 1 }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
                barcodeTypes: ["qr"]
            }}
        />
    );
}
