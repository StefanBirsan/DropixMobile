import {Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import React, {useEffect, useState} from "react";
import { database, ref, set, push } from "@/scripts/firebase";

export default function MainScreen() {

    const navigation = useNavigation();
    const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 1000000000) + 1);
    const [awb, setAwb] = useState(`AWB${randomNumber}`);
    const [Address, setAddress] = useState("");
    const [City, setCity] = useState("");
    const [productName, setProductName] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        if (Address.trim() && City.trim() && productName.trim()) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [Address, City, productName]);

    const sendToDatabase= () => {
        Alert.alert("AWB Created Successfully!");
        navigation.goBack();
        const data = {
                Address: Address,
                City: City,
                Status: "Processing",
                productName: productName,
        };

        const boxRef = ref(database, `BOX/${awb}`);
        set(boxRef, data)
            .then(() => {
                console.log("Data sent successfully!");
                setAddress("");
                setCity("");
                setProductName("");
                const newRandomNumber = Math.floor(Math.random() * 1000000000) + 1;
                setAwb(`AWB${newRandomNumber}`);
            })
            .catch((error) => {
                console.error("Error sending data: ", error);
            });
    };

    return (
            <View style={styles.Screen}>
                <View style={styles.Header}>
                    <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.Body}>
                    <KeyboardAvoidingView behavior="padding" style={styles.SendForm}>
                        <View style={styles.SendForm}>
                            <View style={styles.Credentials}>
                                <Text style={styles.leftText}>AWB</Text>
                                <TextInput
                                    style={styles.LabelField}
                                    editable={false}
                                    value={awb}
                                    autoCapitalize="none"
                                />
                                <Text style={styles.leftText}>Address</Text>
                                <TextInput
                                    style={styles.LabelField}
                                    value={Address}
                                    autoCapitalize="none"
                                    onChangeText={setAddress}
                                />
                                <Text style={styles.leftText}>City</Text>
                                <TextInput
                                    style={styles.LabelField}
                                    value={City}
                                    autoCapitalize="none"
                                    onChangeText={setCity}
                                />
                                <Text style={styles.leftText}>Product</Text>
                                <TextInput
                                    style={styles.LabelField}
                                    value={productName}
                                    autoCapitalize="none"
                                    onChangeText={setProductName}
                                />
                                <TouchableOpacity
                                    disabled={isButtonDisabled}
                                    style={{
                                    backgroundColor: isButtonDisabled ? "grey" : '#E1EACD',
                                    borderColor: '#6256CA',
                                    marginTop: wp('15%'),
                                    paddingVertical: 12,
                                    paddingHorizontal: 20,
                                    borderRadius: 100,
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderStyle: 'solid',
                                    elevation: 5,
                                    width: wp('30%'),
                                }} onPress={(sendToDatabase)}>
                                    <Text style={styles.SendText}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                </View>
            </View>
        )
    }

const styles = StyleSheet.create({
    Screen: {
        height: '100%',
        backgroundColor: "#F9F6E6",
    },
    Body: {
        flex: 5,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    Header: {
        flex: 1,
        marginLeft: wp('5%'),
        justifyContent: "space-evenly",
    },
    backButton:{
        backgroundColor: '#8D77AB',
        borderWidth: 1,
        borderColor: '#664e8b',
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 100,
        alignItems: 'center',
        marginTop: 20,
        elevation: 5,
        width: '20%',
    },
    backText:{
        color:"#FFF",
        fontWeight:"bold",
        fontSize: 20,
        textShadowColor: 'black',
        textShadowOffset: {width:1, height: 1},
        textShadowRadius: 3,
    },
    Credentials: {
        width: wp('100%'),
        height: '60%',
        alignItems: 'center',
        marginTop: '5%',
        justifyContent: 'space-evenly',
        elevation: 5,
    },
    leftText:{
        left: '-20%',
        color: 'white',
        outline: 'black',
        textShadowColor: 'black',
        textShadowOffset: {width:1, height: 1},
        textShadowRadius: 2,
        fontSize: 22,
    },
    LabelField: {
        fontSize: 20,
        backgroundColor: 'white',
        borderRadius: 30,
        width: '80%',
        textAlign: 'center',
        borderWidth: 2,
        margin: 15,
    },
    SendForm: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#8D77AB',
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        elevation: 5,
    },
    SendText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
});