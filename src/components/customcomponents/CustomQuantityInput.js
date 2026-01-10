import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomQuantityInput = ({
    initialValue = 1,
    min = 0,
    max = 9999,
    onChangeValue = () => { },

    // NEW props for sizes
    buttonSize = 40,
    inputWidth = 60,
    inputHeight = 40,
    fontSize = 18,
    loading
}) => {

    const [value, setValue] = useState(String(initialValue));

    const updateValue = (num) => {
        if (num < min || num > max) return;
        setValue(String(num));
        onChangeValue(num);
    };

    const handleIncrease = () => {
        updateValue(parseInt(value || 0) + 1);
    };

    const handleDecrease = () => {
        updateValue(parseInt(value || 0) - 1);
    };

    const handleChangeText = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '');
        setValue(cleaned);
        if (cleaned !== '') updateValue(parseInt(cleaned));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity disabled={loading}
                style={[styles.button, { width: buttonSize, height: buttonSize }]}
                onPress={handleDecrease}
            >
                <Text style={[styles.btnText, { fontSize }]}>-</Text>
            </TouchableOpacity>

            <TextInput
                style={[
                    styles.input,
                    { width: inputWidth, height: inputHeight, fontSize, color: '#fff' },
                ]}
                value={value}
                keyboardType="numeric"
                onChangeText={handleChangeText}
                editable={false}
            />

            <TouchableOpacity
                disabled={loading}
                style={[styles.button, { width: buttonSize, height: buttonSize }]}
                onPress={handleIncrease}
            >
                <Text style={[styles.btnText, { fontSize }]}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        backgroundColor: "rgba(255,255,255,0.1)",
        // borderWidth: 1,
        // borderColor: '#aaa',
    },
    btnText: {
        fontWeight: '600',
        color: '#fff'
    },
    input: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        textAlign: 'center',
        marginHorizontal: 8,
        borderRadius: 6,
        padding: 0,
    },
});

export default CustomQuantityInput;