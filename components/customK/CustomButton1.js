import React from 'react';
import { Text, TouchableOpacity } from "react-native";

const CustomButton1 = ({ text, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button1}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = {
    button1: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#BAD8B6',
        borderRadius: 20,
        width: '35%',
        height: '15%',
    },
    buttonText: {
        fontSize: 18,
    }
}

export default CustomButton1;
