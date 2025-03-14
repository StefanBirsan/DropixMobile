import React from 'react';
import { Text, TouchableOpacity } from "react-native";

const CustomButton1 = ({ text, onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.button1, style]}>
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
    },
    buttonText: {
        fontSize: 18,
    }
}

export default CustomButton1;
