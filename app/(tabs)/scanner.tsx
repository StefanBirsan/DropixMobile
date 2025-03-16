import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {widthPercentageToDP as wp} from "react-native-responsive-screen";

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
            console.log("Permission Granted")
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
        <View style={styles.container}>
            <CameraView
                style={{ flex: 1 }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
            />
            <View style={styles.centered}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    )}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    centered: {
        position: 'absolute',
        top: '90%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        borderRadius: 10,
        height: '10%',
        width: '20%',
        alignItems: 'center',
        alignSelf: 'center',
    },
    backButton:{
        backgroundColor: '#8D77AB',
        borderWidth: 1,
        borderColor: '#664e8b',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
        width: wp('30%'),
    },
    buttonText:{
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 25,
        textShadowColor: 'black',
        textShadowOffset: {width:1, height: 1},
        textShadowRadius: 3,
    },
    })
