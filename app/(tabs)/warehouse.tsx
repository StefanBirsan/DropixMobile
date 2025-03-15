import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import React, {useEffect, useState} from "react";
import {app, auth, getApp, getAuth, ref, database, set, push, get} from "@/scripts/firebase";

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
        return (
            <ScrollView style={styles.Screen}>
                <View style={styles.Body}>
                    {packages.map((pkg, index) => (
                        <View key={index} style={styles.packageContainer}>
                            <Text style={styles.packageInfo}>Address: {pkg.Address}</Text>
                            <Text style={styles.packageInfo}>City: {pkg.City}</Text>
                            <Text style={styles.packageInfo}>Status: {pkg.Status}</Text>
                            <Text style={styles.packageTitle}>Product: {pkg.productName}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.Footer}>
                    <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    };

const styles = StyleSheet.create({
    Screen: {
        height: '100%',
        backgroundColor: "#F9F6E6",
    },
    Body: {
        flex: 3,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    Footer: {
        flex: 1,
        height: '20%',
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    backButton: {
        backgroundColor: '#6256CA',
        paddingVertical: 12,
        borderRadius: 10,
        marginBottom: 12,
        width: wp('70%'),
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 5,
    },
    backText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    packageContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        elevation: 3,  // For Android shadow
        shadowColor: '#000',  // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
    },
    packageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    packageInfo: {
        fontSize: 14,
        marginBottom: 5,
    },
});