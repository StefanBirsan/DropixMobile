import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

const App = () => {
    const onSuccess = (e: any) => {
        console.log('QR Code Scanned:', e.data);
    };

    return (
        <View style={styles.container}>
            <QRCodeScanner
                onRead={onSuccess}
                showMarker
                cameraStyle={styles.camera}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
    },
});

export default App;
