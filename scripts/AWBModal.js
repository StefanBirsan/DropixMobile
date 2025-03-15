import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


const AWBModal = ({ awbInfo, address, city, status, productName }) => {
    return (
        <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
                <Text style={styles.header}>AWB Info</Text>
                    <Text style={styles.info}>{awbInfo}</Text>
                    <Text style={styles.info}>{address}</Text>
                    <Text style={styles.info}>{city}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    info:{

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBoxWithBorder: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#6256CA',
        alignItems: 'center',
        width: '80%',
        maxHeight: '50%',
        justifyContent: 'center',
    },
    modalBox: {
        width: '60%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 0,
        padding: 20,
        alignItems: 'center',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: '85%',
        marginTop: 50,

    },
    buttonContainer:{
        backgroundColor: '#6256CA',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
        justifyContent: 'flex-end'
    },
    picButton:{
        color: "#FDFAD9",
    },
    input: {
        height: 40,
        width: 200,
        borderColor: '#333',
        borderWidth: 1,
        borderRadius:8 ,
        paddingLeft: 15,
        fontSize: 17,
    },
    closeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#8D77AB',
        borderRadius: 12,
    }
});

export default AWBModal;