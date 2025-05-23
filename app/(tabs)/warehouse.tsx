import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import React, { useEffect, useState } from "react";
import { ref, database, get } from "@/scripts/firebase";
import BackgroundImage from "@/assets/images/Background1.png";

export default function MainScreen() {
    const navigation = useNavigation();
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await get(ref(database, 'BOX'));
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const packageList = Object.keys(data).map(key => data[key]);
                    setPackages(packageList);
                } else {
                    console.log('No data available');
                }
            } catch (error) {
                console.error('Error fetching data from Firebase Realtime Database:', error);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Processing":
                return "darkorange";
            case "Delivered":
                return "green";
            case "In Transit":
                return "orange";
            case "Pending":
                return "purple";
            default:
                return "gray"; // Default color if status is unknown
        }
    };


    return (
        <ImageBackground source={BackgroundImage} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.Body}>
                    {packages.map((pkg, index) => (
                        <View key={index} style={styles.packageContainer}>
                            <Text style={styles.packageInfo}>Address: {pkg.Address}</Text>
                            <Text style={styles.packageInfo}>City: {pkg.City}</Text>
                            <Text style={[styles.packageInfo, {color: getStatusColor(pkg.Status)}]}>Status: {pkg.Status}</Text>
                            {pkg.plasticBags > 0 && (
                                <Text style={styles.packageInfo}>Plastic Bags: {pkg.plasticBags}</Text>
                            )}
                            <Text style={styles.packageTitle}>Product: {pkg.productName}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.Footer}>
                <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F6E6",
    },
    scrollContainer: {
        paddingBottom: 100,
        paddingTop: wp('5%'),
    },
    Body: {
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: 20,
    },
    Footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        backgroundColor: '#8D77AB',
        borderWidth: 1,
        borderColor: '#664e8b',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 5,
        width: wp('40%'),
    },
    backText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 25,
        textShadowColor: 'black',
        textShadowOffset: {width:1, height: 1},
        textShadowRadius: 3,
    },
    packageContainer: {
        backgroundColor: '#F9F6E6',
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#664e8b',
        borderRadius: 10,
        marginBottom: wp('5%'),
        width: wp('85%'),
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 5,
    },
    packageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    packageInfo: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
    },
});

