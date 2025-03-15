import { Alert, View } from "react-native";
import { CameraView } from "expo-camera";
import { useState } from "react";

const Scanner = () => {
    const [scanned, setScanned] = useState(false);

    const handleBarcodeScanned = ({ data }) => {
        if (!scanned) {
            setScanned(true);
            Alert.alert("QR Code Scanned", data, [
                { text: "OK", onPress: () => setScanned(false) }
            ]);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <CameraView
                style={{ flex: 1 }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"]
                }}
            />
        </View>
    );
};

export default Scanner;
